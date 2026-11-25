
/*
 * BLS Employment Change Visualization
 * Diverging horizontal bar chart: 2025–2035
 *
 * Data values are expressed in thousands of jobs.
 * Uses the existing BLS change column directly.
 *
 * This visualization is independent of employment.js.
 */

(() => {
    "use strict";

    // ----------------------------------------
    // Configuration
    // ----------------------------------------

    const HIERARCHY_PATH = "data/processed/bls_occupation_hierarchy.json";
    const EMPLOYMENT_PATH = "data/processed/bls_employment.json";

    const COLORS = {
        growth: "#91CDB4",
        decline: "#E7A2A5",
        neutral: "#A7B8C9",
        zero: "#64748B",
        grid: "#E5E7EB",
        text: "#25282A"
    };

    // Selected occupations for this chart only
    // Selected occupations for this chart only
    const selectedCodes = new Set([
        "11-0000",  // Management occupations
        "13-0000",  // Business and financial operations occupations
        "15-0000",  // Computer and mathematical occupations
        "17-0000"   // Architecture and engineering occupations
        "35-0000",  // Food preparation and serving related occupations
        "41-0000",  // Sales and related occupations
        "43-0000",  // Office and administrative support occupations
        "29-0000"   // Healthcare practitioners and technical occupations
    ]);

    let employmentData = [];
    let employmentByCode = new Map();

    const formatValue = d3.format("+,.1f");
    const formatEmployment = d3.format(",.1f");

    // ----------------------------------------
    // Load data
    // ----------------------------------------

    async function initialize() {
        try {
            const [hierarchy, rawData] = await Promise.all([
                d3.json(HIERARCHY_PATH),
                d3.json(EMPLOYMENT_PATH)
            ]);

            // Normalize numeric fields without
            // recalculating employment changes
            employmentData = rawData.map(d => ({
                ...d,
                employment_2025: toNumber(d.employment_2025),
                employment_2035: toNumber(d.employment_2035),
                employment_change_numeric_2025_35:
                    toNumber(d.employment_change_numeric_2025_35)
            }));

            employmentByCode = new Map(
                employmentData.map(d => [d.code, d])
            );

            renderTree(hierarchy);
            renderChart();

            console.log(
                "Employment change visualization loaded:",
                employmentData.length,
                "records"
            );

        } catch (error) {
            console.error("Error loading employment data:", error);

            d3.select("#change-occupation-tree")
                .text("Unable to load occupation data.");

            d3.select("#employment-change-chart")
                .text("Unable to load chart data.");
        }
    }

    function toNumber(value) {
        if (value === null || value === undefined || value === "") {
            return NaN;
        }

        return Number(String(value).replace(/,/g, ""));
    }

    // ----------------------------------------
    // Occupation selection tree
    // ----------------------------------------

    function renderTree(hierarchy) {
        const container = d3.select("#change-occupation-tree");
        container.selectAll("*").remove();

        function createNode(parent, occupation) {
            const node = parent.append("div")
                .attr("class", "change-tree-node");

            const row = node.append("div")
                .attr("class", "change-tree-row");

            const children = occupation.children || [];
            const hasChildren = children.length > 0;

            const childrenContainer = node.append("div")
                .attr("class", "change-tree-children")
                .style("display", "none");

            // Expand/collapse is independent of selection
            if (hasChildren) {
                row.append("button")
                    .attr("type", "button")
                    .attr("class", "change-tree-toggle")
                    .attr("aria-label", "Expand or collapse")
                    .attr("aria-expanded", "false")
                    .text("▶")
                    .on("click", function () {
                        const isOpen =
                            childrenContainer.style("display") !== "none";

                        childrenContainer.style(
                            "display",
                            isOpen ? "none" : "block"
                        );

                        d3.select(this)
                            .text(isOpen ? "▶" : "▼")
                            .attr("aria-expanded", String(!isOpen));
                    });
            } else {
                row.append("span")
                    .attr("class", "change-tree-spacer");
            }

            const label = row.append("label")
                .attr("class", "change-tree-label");

            // Each occupation is independently selectable
            label.append("input")
                .attr("type", "checkbox")
                .attr("value", occupation.code)
                .property(
                    "checked",
                    selectedCodes.has(occupation.code)
                )
                .on("change", function () {
                    if (this.checked) {
                        selectedCodes.add(occupation.code);
                    } else {
                        selectedCodes.delete(occupation.code);
                    }

                    updateSelectionCount();
                    renderChart();
                });

            label.append("span")
                .text(`${occupation.name} (${occupation.code})`);

            if (hasChildren) {
                children.forEach(child => {
                    createNode(childrenContainer, child);
                });
            }
        }

        hierarchy.forEach(occupation => {
            createNode(container, occupation);
        });

        updateSelectionCount();
    }

    function updateSelectionCount() {
        d3.select("#change-selection-count")
            .text(`${selectedCodes.size} occupations selected`);
    }

    // ----------------------------------------
    // Diverging horizontal bar chart
    // ----------------------------------------

    function renderChart() {
        const container = d3.select("#employment-change-chart");
        container.selectAll("*").remove();

        // Use the existing numeric change field.
        // Do not calculate 2035 minus 2025 again.
        const data = [...selectedCodes]
            .map(code => employmentByCode.get(code))
            .filter(d =>
                d &&
                Number.isFinite(
                    d.employment_change_numeric_2025_35
                )
            )
            // Sort occupations by absolute employment change (largest first)
            .sort((a, b) =>
                Math.abs(b.employment_change_numeric_2025_35) -
                Math.abs(a.employment_change_numeric_2025_35)
            );

        if (selectedCodes.size === 0) {
            container.append("p")
                .attr("class", "change-empty-message")
                .text("Select occupations to display projected employment changes.");
            return;
        }

        if (data.length === 0) {
            container.append("p")
                .attr("class", "change-empty-message")
                .text("No valid employment change data for the selected occupations.");
            return;
        }

        // Show a warning if some selected occupations
        // do not have numeric change data
        if (data.length < selectedCodes.size) {
            container.append("p")
                .attr("class", "change-data-warning")
                .text(
                    `${selectedCodes.size - data.length} selected occupations have no available change value.`
                );
        }

        // Chart dimensions
        const margin = {
            top: 40,
            right: 95,
            bottom: 75,
            left: 240
        };

        const width = 920;
        const rowHeight = 52;

        const innerWidth =
            width - margin.left - margin.right;

        const innerHeight =
            data.length * rowHeight;

        const height =
            margin.top + innerHeight + margin.bottom;

        // Scrollable chart area
        const scrollArea = container.append("div")
            .attr("class", "change-chart-scroll");

        const svg = scrollArea.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("role", "img")
            .attr(
                "aria-label",
                "Projected employment change by occupation, 2025 to 2035"
            );

        const chart = svg.append("g")
            .attr(
                "transform",
                `translate(${margin.left},${margin.top})`
            );

        // Symmetric scale: zero stays exactly in the center
        const maxAbsoluteChange =
            d3.max(data, d =>
                Math.abs(d.employment_change_numeric_2025_35)
            ) || 0;

        const limit = Math.max(1, maxAbsoluteChange * 1.15);

        const x = d3.scaleLinear()
            .domain([-limit, limit])
            .range([0, innerWidth]);

        // Occupations are sorted by 2025 employment
        const y = d3.scaleBand()
            .domain(data.map(d => d.code))
            .range([0, innerHeight])
            .padding(0.3);

        // Vertical grid lines
        const grid = chart.append("g")
            .attr("class", "change-grid")
            .call(
                d3.axisBottom(x)
                    .ticks(6)
                    .tickSize(innerHeight)
                    .tickFormat("")
            );

        grid.select(".domain").remove();

        grid.selectAll("line")
            .attr("stroke", COLORS.grid);

        // Central zero reference line
        chart.append("line")
            .attr("class", "change-zero-line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", 0)
            .attr("y2", innerHeight)
            .attr("stroke", COLORS.zero)
            .attr("stroke-width", 2);

        // One horizontal bar per occupation
        const bars = chart.selectAll(".change-bar")
            .data(data)
            .join("rect")
            .attr("class", "change-bar")
            .attr("x", d => Math.min(
                x(0),
                x(d.employment_change_numeric_2025_35)
            ))
            .attr("y", d => y(d.code))
            .attr("width", d => Math.abs(
                x(d.employment_change_numeric_2025_35) -
                x(0)
            ))
            .attr("height", y.bandwidth())
            .attr("rx", 4)
            .attr("fill", d => {
                const change =
                    d.employment_change_numeric_2025_35;

                if (change > 0) return COLORS.growth;
                if (change < 0) return COLORS.decline;
                return COLORS.neutral;
            });

        // Native hover tooltip
        bars.append("title")
            .text(d => {
                const change =
                    d.employment_change_numeric_2025_35;

                return [
                    `${d.name} (${d.code})`,
                    `2025: ${formatEmployment(d.employment_2025)} thousand`,
                    `2035: ${formatEmployment(d.employment_2035)} thousand`,
                    `Change: ${formatValue(change)} thousand jobs`
                ].join("\n");
            });

        // Occupation labels
        chart.selectAll(".change-occupation-label")
            .data(data)
            .join("text")
            .attr("class", "change-occupation-label")
            .attr("x", -12)
            .attr(
                "y",
                d => y(d.code) + y.bandwidth() / 2
            )
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("fill", COLORS.text)
            .attr("font-size", "12px")
            .attr("font-family", "Fira Sans")
            .text(d =>
                d.name.length > 32
                    ? d.name.slice(0, 29) + "..."
                    : d.name
            )
            .append("title")
            .text(d => d.name);

        // Change value labels
        chart.selectAll(".change-value-label")
            .data(data)
            .join("text")
            .attr("class", "change-value-label")
            .attr("x", d => {
                const change =
                    d.employment_change_numeric_2025_35;

                return x(change) + (change >= 0 ? 8 : -8);
            })
            .attr(
                "y",
                d => y(d.code) + y.bandwidth() / 2
            )
            .attr("text-anchor", d =>
                d.employment_change_numeric_2025_35 >= 0
                    ? "start"
                    : "end"
            )
            .attr("dominant-baseline", "middle")
            .attr("fill", COLORS.text)
            .attr("font-size", "11px")
            .attr("font-family", "Fira Sans")
            .attr("font-weight", "600")
            .text(d =>
                formatValue(
                    d.employment_change_numeric_2025_35
                )
            );

        // Numeric horizontal axis
        chart.append("g")
            .attr(
                "transform",
                `translate(0,${innerHeight})`
            )
            .call(
                d3.axisBottom(x)
                    .ticks(6)
                    .tickFormat(d3.format("~g"))
            );

        // Axis title
        chart.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 55)
            .attr("text-anchor", "middle")
            .attr("fill", COLORS.text)
            .attr("font-size", "13px")
            .attr("font-family", "Fira Sans")
            .text("Change in Employment (Thousands of Jobs)");

        // Legend
        const legend = svg.append("g")
            .attr(
                "transform",
                `translate(${margin.left},12)`
            );

        const legendItems = [
            {
                label: "Projected Growth",
                color: COLORS.growth
            },
            {
                label: "Projected Decline",
                color: COLORS.decline
            }
        ];

        legendItems.forEach((item, index) => {
            const group = legend.append("g")
                .attr(
                    "transform",
                    `translate(${index * 180},0)`
                );

            group.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("rx", 3)
                .attr("fill", item.color);

            group.append("text")
                .attr("x", 18)
                .attr("y", 11)
                .attr("fill", COLORS.text)
                .attr("font-size", "12px")
                .attr("font-family", "Fira Sans")
                .text(item.label);
        });
    }

    // ----------------------------------------
    // Initialize when the page is ready
    // ----------------------------------------

    document.addEventListener("DOMContentLoaded", initialize);

})();
