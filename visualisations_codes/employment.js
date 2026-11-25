// File paths for the occupation hierarchy and employment data
const HIERARCHY_PATH = "data/bls_occupation_hierarchy.json";
const EMPLOYMENT_PATH = "data/bls_employment_chart.json";


// Pastel color palette for employment comparisons
const CHART_COLORS = {
    baseline: "#A7B8C9",
    growth: "#91CDB4",
    decline: "#E7A2A5"
};

// Determine the 2035 bar color based on employment change
function get2035Color(d) {
    if (d.employment_2035 > d.employment_2025) {
        return CHART_COLORS.growth;
    }

    if (d.employment_2035 < d.employment_2025) {
        return CHART_COLORS.decline;
    }

    return CHART_COLORS.baseline;
}


// Store the occupations selected by the user
const selectedOccupations = new Set();
// Keep employment data accessible to all chart functions
let employmentDataGlobal = [];

// Load both JSON files when the page opens
async function initializeEmploymentChart() {
    try {
        const [hierarchy, employmentData] = await Promise.all([
            d3.json(HIERARCHY_PATH),
            d3.json(EMPLOYMENT_PATH)
        ]);

        console.log("Hierarchy loaded:", hierarchy.length, "major groups");
        console.log("Employment records loaded:", employmentData.length);

        // Save employment data for later chart updates
        employmentDataGlobal = employmentData;

        // Display an initial empty chart message
        renderEmploymentChart(employmentDataGlobal);

        // Build the occupation selection tree
        renderOccupationTree(hierarchy);

    } catch (error) {
        console.error("Error loading employment data:", error);

        document.getElementById("occupation-tree").textContent =
            "Error loading occupation data.";
    }
}

// Start loading after the page is ready
document.addEventListener("DOMContentLoaded", initializeEmploymentChart);

// Build the interactive occupation tree
function renderOccupationTree(hierarchy) {

    const container = d3.select("#occupation-tree");

    // Clear previous content
    container.selectAll("*").remove();

    // Create a nested item for every occupation
    function createNode(parent, occupation) {

        const node = parent.append("div")
            .attr("class", "occupation-node");

        const row = node.append("div")
            .attr("class", "occupation-row");

        const hasChildren = occupation.children?.length > 0;

        // Create a container for child occupations
        const childrenContainer = node.append("div")
            .attr("class", "occupation-children")
            .style("display", "none");

        // Add expand/collapse button
        if (hasChildren) {
            row.append("button")
                .attr("type", "button")
                .attr("class", "tree-toggle")
                .text("▶")
                .on("click", function () {

                    const isOpen =
                        childrenContainer.style("display") !== "none";

                    childrenContainer.style(
                        "display",
                        isOpen ? "none" : "block"
                    );

                    d3.select(this).text(isOpen ? "▶" : "▼");
                });
        } else {
            row.append("span")
                .attr("class", "tree-spacer");
        }

        // Add an independent checkbox for each occupation
        const label = row.append("label");

        label.append("input")
            .attr("type", "checkbox")
            .attr("value", occupation.code)
            .on("change", function () {

                if (this.checked) {
                    selectedOccupations.add(occupation.code);
                } else {
                    selectedOccupations.delete(occupation.code);
                }

                console.log(
                    "Selected occupations:",
                    [...selectedOccupations]
                );
                // Redraw the chart when the selection changes
                renderEmploymentChart(employmentDataGlobal);
            });

        // Display occupation name and code
        label.append("span")
            .text(`${occupation.name} (${occupation.code})`);

        // Recursively create all children
        if (hasChildren) {
            occupation.children.forEach(child => {
                createNode(childrenContainer, child);
            });
        }
    }

    // Start from the major occupation groups
    hierarchy.forEach(occupation => {
        createNode(container, occupation);
    });
}

//graph making function
// Draw a horizontal grouped bar chart for selected occupations
function renderEmploymentChart(employmentData) {
    const container = d3.select("#employment-chart");
    container.selectAll("*").remove();

    // Find the selected occupations and sort them
    const data = employmentData
        .filter(d => selectedOccupations.has(d.code))
        .sort((a, b) =>
            b.employment_2025 - a.employment_2025 ||
            b.employment_2035 - a.employment_2035
        );

    if (data.length === 0) {
        container.append("p")
            .text("Select occupations from the tree to display the chart.");
        return;
    }

    // Chart dimensions
    const margin = { top: 35, right: 50, bottom: 55, left: 260 };
    const width = 950;
    const rowHeight = 65;
    const height = margin.top + margin.bottom + data.length * rowHeight;

    // Create a scrollable chart container
    const scrollArea = container.append("div")
        .style("max-height", "550px")
        .style("overflow-y", "auto")
        .style("overflow-x", "auto");

    const svg = scrollArea.append("svg")
        .attr("width", width)
        .attr("height", height);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = data.length * rowHeight;

    // Employment scale
    const x = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d =>
                Math.max(d.employment_2025, d.employment_2035)
            )
        ])
        .nice()
        .range([0, innerWidth]);

    // Occupation positions
    const y = d3.scaleBand()
        .domain(data.map(d => d.code))
        .range([0, innerHeight])
        .padding(0.2);

    // Positions of 2025 and 2035 bars within each occupation
    const yYear = d3.scaleBand()
        .domain(["2025", "2035"])
        .range([0, y.bandwidth()])
        .padding(0.08);

    // Draw horizontal bars
    const groups = chart.selectAll(".occupation-group")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0,${y(d.code)})`);

    groups.append("rect")
        .attr("x", 0)
        .attr("y", yYear("2025"))
        .attr("width", d => x(d.employment_2025))
        .attr("height", yYear.bandwidth())
        // Neutral pastel color for 2025
        .attr("fill", CHART_COLORS.baseline);

    groups.append("rect")
        .attr("x", 0)
        .attr("y", yYear("2035"))
        .attr("width", d => x(d.employment_2035))
        .attr("height", yYear.bandwidth())
        // Dynamic color based on projected growth or decline
        .attr("fill", d => get2035Color(d));

    // Add occupation labels
    chart.selectAll(".occupation-label")
        .data(data)
        .join("text")
        .attr("x", -12)
        .attr("y", d => y(d.code) + y.bandwidth() / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .text(d => d.name.length > 34
            ? d.name.slice(0, 31) + "..."
            : d.name
        );

    // Add horizontal value axis
    chart.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(6));

    // Axis title
    chart.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .text("Employment (thousands)");

    // Legend
    
    const legend = svg.append("g")
        .attr("transform", `translate(${margin.left},12)`);

    const legendItems = [
        { label: "2025", color: CHART_COLORS.baseline },
        { label: "2035 — Growth", color: CHART_COLORS.growth },
        { label: "2035 — Decline", color: CHART_COLORS.decline }
    ];

    legendItems.forEach((item, i) => {
        const group = legend.append("g")
            .attr("transform", `translate(${i * 170},0)`);

        group.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("rx", 3)
            .attr("fill", item.color);

        group.append("text")
            .attr("x", 18)
            .attr("y", 11)
            .attr("font-size", "12px")
            .text(item.label);
    });

}