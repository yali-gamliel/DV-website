/* Planning robustness chart: Stanford AI Index 2026, figures 2.4.9 and 2.4.10.
 * Data preparation is in first_visualizations.py; this file only renders JSON.
 * LAMA is a classical planner, not a language model.
 */
(() => {
  "use strict";

  const modelSelect = document.getElementById("planning-model");
  const chartContainer = document.getElementById("planning-chart");
  const summary = document.getElementById("planning-summary");
  const status = document.getElementById("planning-status");
  if (!modelSelect || !chartContainer || !summary || !status) return;

  if (typeof d3 === "undefined") {
    status.textContent = "The chart library could not be loaded. Please try again.";
    return;
  }

  const domains = [
    "Blocksworld", "Childsnack", "Floortile", "Miconic",
    "Rovers", "Sokoban", "Spanner", "Transport"
  ];
  const conditions = ["Standard", "Obfuscated"];
  const systems = ["GPT-5", "Gemini", "R1", "LAMA"];
  const colors = { Standard: "#1766a6", Obfuscated: "#cc722d" };
  const width = 1060;
  const height = 510;
  const margin = { top: 28, right: 22, bottom: 116, left: 72 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  function validateRecords(records) {
    if (!Array.isArray(records) || records.length !== 64) {
      throw new Error("Expected 64 planning records.");
    }
    const keys = new Set();
    records.forEach((d) => {
      const key = [d.model_planner, d.domain, d.condition].join("|");
      if (!systems.includes(d.model_planner) ||
          !domains.includes(d.domain) ||
          !conditions.includes(d.condition) ||
          !Number.isInteger(d.solved_tasks) ||
          d.solved_tasks < 0 || d.solved_tasks > 45 ||
          d.total_tasks !== 45 || keys.has(key)) {
        throw new Error("Invalid or duplicate planning record: " + key);
      }
      keys.add(key);
    });
  }

  function renderChart(records) {
    const selectedModel = modelSelect.value;
    const subset = records.filter((d) => d.model_planner === selectedModel);
    const lookup = new Map(subset.map((d) => [d.domain + "|" + d.condition, d]));

    chartContainer.replaceChildren();

    const svg = d3.select(chartContainer)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("role", "img")
      .attr("aria-label", "Grouped bar chart for " + selectedModel +
        ": tasks solved in eight planning domains under standard and obfuscated names");

    const plot = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xDomain = d3.scaleBand()
      .domain(domains)
      .range([0, plotWidth])
      .paddingInner(0.2)
      .paddingOuter(0.06);

    const xCondition = d3.scaleBand()
      .domain(conditions)
      .range([0, xDomain.bandwidth()])
      .padding(0.08);

    const y = d3.scaleLinear()
      .domain([0, 45])
      .range([plotHeight, 0]);

    const ticks = [0, 10, 20, 30, 40, 45];

    plot.append("g")
      .attr("class", "planning-grid")
      .call(d3.axisLeft(y).tickValues(ticks).tickSize(-plotWidth).tickFormat(""));

    plot.append("g")
      .attr("class", "planning-axis")
      .call(d3.axisLeft(y).tickValues(ticks).tickSizeOuter(0));

    plot.append("text")
      .attr("class", "planning-axis-title")
      .attr("transform", "rotate(-90)")
      .attr("x", -plotHeight / 2)
      .attr("y", -51)
      .attr("text-anchor", "middle")
      .text("Tasks solved (out of 45)");

    const xAxis = plot.append("g")
      .attr("class", "planning-axis planning-x-axis")
      .attr("transform", "translate(0," + plotHeight + ")")
      .call(d3.axisBottom(xDomain).tickSize(0));

    xAxis.selectAll("text")
      .attr("transform", "rotate(-28)")
      .style("text-anchor", "end")
      .attr("dx", "-0.6em")
      .attr("dy", "0.3em");

    const domainGroups = plot.selectAll(".planning-domain-group")
      .data(domains)
      .join("g")
      .attr("class", "planning-domain-group")
      .attr("transform", (domain) => "translate(" + xDomain(domain) + ",0)");

    domainGroups.selectAll("rect")
      .data((domain) => conditions.map((condition) => lookup.get(domain + "|" + condition)))
      .join("rect")
      .attr("x", (d) => xCondition(d.condition))
      .attr("y", (d) => y(d.solved_tasks))
      .attr("width", xCondition.bandwidth())
      .attr("height", (d) => plotHeight - y(d.solved_tasks))
      .attr("fill", (d) => colors[d.condition])
      .attr("tabindex", 0)
      .attr("aria-label", (d) => d.domain + ", " + d.condition + ": " +
        d.solved_tasks + " of 45 tasks solved (" + d.success_rate_pct + "%)");

    domainGroups.selectAll("rect")
      .append("title")
      .text((d) => selectedModel + " | " + d.domain + " | " + d.condition +
        ": " + d.solved_tasks + "/45 tasks (" + d.success_rate_pct + "%)");

    const standard = d3.sum(subset.filter((d) => d.condition === "Standard"), (d) => d.solved_tasks);
    const obfuscated = d3.sum(subset.filter((d) => d.condition === "Obfuscated"), (d) => d.solved_tasks);
    const change = obfuscated - standard;
    const changeLabel = (change > 0 ? "+" : "") + change;
    summary.textContent = selectedModel + ": " + standard + "/360 tasks solved with standard names, " +
      obfuscated + "/360 with obfuscated names (difference: " + changeLabel + " tasks).";
    status.textContent = "";
  }

  d3.json("data/processed/planning_robustness.json")
    .then((records) => {
      validateRecords(records);
      modelSelect.addEventListener("change", () => renderChart(records));
      renderChart(records);
    })
    .catch((error) => {
      console.error("Planning chart:", error);
      chartContainer.replaceChildren();
      status.textContent = "Unable to load planning data. Check the JSON file and try refreshing.";
    });
})();
