
/*
 * BLS Employment Projections - Waffle Chart
 *
 * Shows the share of detailed occupations projected
 * to grow, decline, or remain unchanged by 2035.
 *
 * Each waffle square represents approximately 1%
 * of detailed occupations with valid change data.
 */

(() => {
    "use strict";

    // ----------------------------------------
    // Configuration
    // ----------------------------------------

    const DATA_PATH = "data/processed/bls_employment.json";
    const CONTAINER_ID = "#employment-waffle-chart";

    const COLORS = {
        growth: "#91CDB4",
        decline: "#E7A2A5",
        unchanged: "#A7B8C9",
        text: "#25282A"
    };

    const CATEGORIES = [
        {
            key: "growth",
            label: "Projected Growth",
            color: COLORS.growth
        },
        {
            key: "decline",
            label: "Projected Decline",
            color: COLORS.decline
        },
        {
            key: "unchanged",
            label: "No Change",
            color: COLORS.unchanged
        }
    ];

    // ----------------------------------------
    // Helpers
    // ----------------------------------------

    function toNumber(value) {
        if (value === null ||
            value === undefined ||
            value === "") {
            return NaN;
        }

        return Number(String(value).replace(/,/g, ""));
    }

    // Use detailed SOC occupations only.
    // In the standard SOC hierarchy, detailed
    // occupation codes end with a nonzero digit.
    function isDetailedOccupation(d) {
        const code = String(d.code ?? "").trim();

        if (d.soc_level) {
            return String(d.soc_level)
                .toLowerCase()
                .trim() === "detailed";
        }

        return /^\d{2}-\d{3}[1-9]$/.test(code);
    }

    function classifyChange(value) {
        if (value > 0) return "growth";
        if (value < 0) return "decline";
        return "unchanged";
    }

    // Allocate exactly 100 squares using
    // the largest-remainder rounding method.
    function allocateSquares(counts, total) {
        const allocation = CATEGORIES.map(category => {
            const exact = counts[category.key] / total * 100;

            return {
                key: category.key,
                exact,
                squares: Math.floor(exact),
                remainder: exact - Math.floor(exact)
            };
        });

        const allocated = d3.sum(
            allocation,
            d => d.squares
        );

        const remaining = 100 - allocated;

        const byRemainder = [...allocation].sort(
            (a, b) => b.remainder - a.remainder
        );

        for (let i = 0; i < remaining; i++) {
            byRemainder[i].squares += 1;
        }

        return Object.fromEntries(
            allocation.map(d => [d.key, d.squares])
        );
    }

    // ----------------------------------------
    // Load and prepare data
    // ----------------------------------------

    async function initializeWaffleChart() {
        const container = d3.select(CONTAINER_ID);

        if (container.empty()) {
            console.warn(
                "Waffle chart container not found:",
                CONTAINER_ID
            );
            return;
        }

        container.selectAll("*").remove();

        try {
            const rawData = await d3.json(DATA_PATH);

            // Select detailed occupations only.
            // Remove missing or invalid change values.
            const data = rawData
                .filter(isDetailedOccupation)
                .map(d => ({
                    ...d,
                    change: toNumber(
                        d.employment_change_numeric_2025_35
                    )
                }))
                .filter(d => Number.isFinite(d.change));

            // Avoid counting duplicate SOC codes.
            const uniqueData = Array.from(
                new Map(
                    data.map(d => [d.code, d])
                ).values()
            );

            if (uniqueData.length === 0) {
                throw new Error(
                    "No detailed occupations with valid change data."
                );
            }

            renderWaffleChart(uniqueData);

        } catch (error) {
            console.error("Waffle chart error:", error);

            container.append("p")
                .attr("class", "waffle-error")
                .text("Unable to load waffle chart data.");
        }
    }

    // ----------------------------------------
    // Draw waffle chart
    // ----------------------------------------

    function renderWaffleChart(data) {
        const container = d3.select(CONTAINER_ID);
        container.selectAll("*").remove();

        // Count detailed occupations by direction
        const counts = {
            growth: 0,
            decline: 0,
            unchanged: 0
        };

        data.forEach(d => {
            const category = classifyChange(d.change);
            counts[category] += 1;
        });

        const total = data.length;

        // Calculate exact percentages
        const percentages = Object.fromEntries(
            CATEGORIES.map(category => [
                category.key,
                counts[category.key] / total * 100
            ])
        );

        // Convert percentages to 100 waffle squares
        const squareCounts = allocateSquares(
            counts,
            total
        );

        const squares = [];

        CATEGORIES.forEach(category => {
            for (
                let i = 0;
                i < squareCounts[category.key];
                i++
            ) {
                squares.push(category.key);
            }
        });

        // ----------------------------------------
        // Chart title and description
        // ----------------------------------------

        container.append("h3")
            .attr("class", "waffle-title")
            .text("Are Most Occupations Expected to Grow or Decline?");

        container.append("p")
            .attr("class", "waffle-description")
            .text(
                "Share of detailed U.S. occupations by projected employment change, 2025–2035."
            );

        // ----------------------------------------
        // SVG dimensions
        // ----------------------------------------

        const columns = 10;
        const rows = 10;

        const squareSize = 30;
        const gap = 5;

        const cellSize = squareSize + gap;

        const width = columns * cellSize - gap;
        const height = rows * cellSize - gap;

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", "100%")
            .style("max-width", `${width}px`)
            .style("height", "auto")
            .attr("role", "img")
            .attr(
                "aria-label",
                "Waffle chart showing the share of occupations projected to grow, decline, or remain unchanged."
            );

        // ----------------------------------------
        // Draw 100 squares
        // ----------------------------------------

        svg.selectAll(".waffle-square")
            .data(squares)
            .join("rect")
            .attr("class", "waffle-square")
            .attr("x", (d, i) =>
                (i % columns) * cellSize
            )
            .attr("y", (d, i) =>
                Math.floor(i / columns) * cellSize
            )
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("rx", 5)
            .attr("fill", categoryKey => {
                return COLORS[categoryKey];
            })
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 1)
            .append("title")
            .text(categoryKey => {
                const category = CATEGORIES.find(
                    d => d.key === categoryKey
                );

                return [
                    category.label,
                    `${counts[categoryKey]} occupations`,
                    `${percentages[categoryKey].toFixed(1)}%`
                ].join("\n");
            });

        // ----------------------------------------
        // Legend with actual percentages
        // ----------------------------------------

        const legend = container.append("div")
            .attr("class", "waffle-legend");

        const legendItems = legend.selectAll(
            ".waffle-legend-item"
        )
            .data(CATEGORIES)
            .join("div")
            .attr("class", "waffle-legend-item");

        legendItems.append("span")
            .attr("class", "waffle-legend-color")
            .style("background-color", d => d.color);

        const legendText = legendItems.append("div")
            .attr("class", "waffle-legend-text");

        legendText.append("strong")
            .text(d =>
                `${percentages[d.key].toFixed(1)}%`
            );

        legendText.append("span")
            .text(d =>
                ` ${d.label} (${counts[d.key]} occupations)`
            );

        // ----------------------------------------
        // Methodology note
        // ----------------------------------------

        container.append("p")
            .attr("class", "waffle-note")
            .text(
                `Based on ${total.toLocaleString("en-US")} detailed occupations with valid projection data. Each occupation is counted equally, regardless of workforce size. Each square represents approximately 1%. Source: U.S. Bureau of Labor Statistics, 2025–2035 Employment Projections. Changes cannot be attributed to AI alone.`
            );

        console.log("Waffle chart counts:", counts);
        console.log("Waffle chart total:", total);
    }

    // ----------------------------------------
    // Initialize
    // ----------------------------------------

    document.addEventListener(
        "DOMContentLoaded",
        initializeWaffleChart
    );

})();
