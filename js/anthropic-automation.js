
const anthropicChart = d3.select("#anthropic-chart");
const anthropicBack = d3.select("#anthropic-back");
const anthropicBreadcrumb = d3.select("#anthropic-breadcrumb");

let anthropicFamilies = [];
let anthropicPath = [];

async function loadAnthropicData() {
    try {
        const response = await fetch(
            "data/processed/anthropic_activity_hierarchy.json"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        anthropicFamilies = await response.json();
        renderAnthropicLevel();

    } catch (error) {
        console.error("Failed to load Anthropic data:", error);
        anthropicChart.text("Unable to load activity data.");
    }
}

function renderAnthropicLevel() {
    // Determine the current level in the hierarchy
    const currentNode = anthropicPath.at(-1);
    const activities = currentNode
        ? currentNode.children
        : anthropicFamilies;

    const sortedActivities = [...activities].sort(
        (a, b) => (b.prevalence ?? -1) - (a.prevalence ?? -1)
    );

    // Update navigation
    anthropicBack.property("hidden", anthropicPath.length === 0);

    anthropicBreadcrumb.text(
        anthropicPath.length === 0
            ? "All activity families"
            : "All activity families / " +
              anthropicPath.map(node => node.name).join(" / ")
    );

    anthropicChart.selectAll("*").remove();

    if (!sortedActivities.length) {
        anthropicChart.append("p")
            .text("No further activities available.");
        return;
    }

    const rows = anthropicChart
        .selectAll(".anthropic-row")
        .data(sortedActivities, d => d.id)
        .join("div")
        .attr("class", "anthropic-row");

    rows.append("div")
        .attr("class", "anthropic-label")
        .text(d => d.name);

    const bars = rows.append("div")
        .attr("class", "anthropic-bar");

    bars.append("div")
        .attr("class", "anthropic-automation")
        .style("width", d => `${d.automation ?? 0}%`)
        .attr("title", d =>
            d.automation == null
                ? "Automation: N/A"
                : `Automation: ${d.automation.toFixed(2)}%`
        );

    bars.append("div")
        .attr("class", "anthropic-augmentation")
        .style("width", d => `${d.augmentation ?? 0}%`)
        .attr("title", d =>
            d.augmentation == null
                ? "Augmentation: N/A"
                : `Augmentation: ${d.augmentation.toFixed(2)}%`
        );

    rows.append("div")
        .attr("class", "anthropic-prevalence")
        .text(d =>
            d.prevalence == null
                ? "Usage: N/A"
                : `Usage: ${d.prevalence.toFixed(2)}%`
        );

    // Only activities with children can be expanded
    rows.filter(d => d.children && d.children.length > 0)
        .classed("anthropic-clickable", true)
        .attr("role", "button")
        .attr("tabindex", 0)
        .attr("aria-label", d => `Explore ${d.name}`)
        .on("click", (event, d) => {
            anthropicPath.push(d);
            renderAnthropicLevel();
        })
        .on("keydown", (event, d) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                anthropicPath.push(d);
                renderAnthropicLevel();
            }
        });
}

anthropicBack.on("click", () => {
    anthropicPath.pop();
    renderAnthropicLevel();
});

loadAnthropicData();
