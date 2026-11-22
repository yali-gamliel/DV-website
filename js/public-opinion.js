/* Public opinion heatmap — Stanford AI Index 2026, fig. 9.1.6 (Ipsos 2025).
 * Shows the share answering that increased AI use will make each area "better"
 * over the next 3–5 years. This is a perception measure, NOT employment data.
 * The published Global aggregate is not a country or a calculated country mean.
 */
(() => {
  "use strict";

  const chartElement = document.getElementById("opinion-chart");
  const sortElement = document.getElementById("opinion-sort");
  const summaryElement = document.getElementById("opinion-summary");
  const legendElement = document.getElementById("opinion-scale");
  const statusElement = document.getElementById("opinion-status");

  if (!chartElement || !sortElement || !summaryElement || !legendElement || !statusElement) return;
  if (typeof d3 === "undefined") {
    statusElement.textContent = "The chart library could not be loaded.";
    return;
  }

  const aspects = [
    { key: "My job", label: "My job" },
    { key: "Job market", label: "Job market" },
    { key: "Country's economy", label: "Country's economy" }
  ];

  const width = 825;
  const left = 171;
  const cellWidth = 200;
  const cellGap = 12;
  const top = 77;
  const rowHeight = 29;
  const rowGap = 4;
  const bottom = 22;

  function cellColor(percent) {
    // Shared, absolute color scale from 0% to 100%; not rescaled by country.
    return d3.interpolateBlues(0.13 + (0.82 * percent / 100));
  }

  function validate(rows) {
    if (!Array.isArray(rows) || rows.length !== 96) {
      throw new Error("Expected 96 public opinion observations.");
    }
    const seen = new Set();
    const countries = new Set();
    rows.forEach((row) => {
      const key = row.country + "|" + row.aspect;
      if (typeof row.country !== "string" ||
          !aspects.some((a) => a.key === row.aspect) ||
          !Number.isFinite(row.share_pct) ||
          row.share_pct < 0 || row.share_pct > 100 ||
          typeof row.is_source_global !== "boolean" ||
          !Number.isInteger(row.country_sort_order) ||
          seen.has(key)) {
        throw new Error("Invalid or duplicated record: " + key);
      }
      if (row.is_source_global !== (row.country === "Global")) {
        throw new Error("Invalid Global aggregate flag: " + key);
      }
      seen.add(key);
      countries.add(row.country);
    });
    if (countries.size !== 32 || !countries.has("Global")) {
      throw new Error("Expected 31 countries and the published Global aggregate.");
    }
    for (const country of countries) {
      for (const aspect of aspects) {
        if (!seen.has(country + "|" + aspect.key)) {
          throw new Error("Missing country-aspect observation.");
        }
      }
    }
  }

  function drawScale() {
    legendElement.replaceChildren();
    const scaleWidth = 330;
    const scaleHeight = 49;
    const svg = d3.select(legendElement).append("svg")
      .attr("viewBox", "0 0 " + scaleWidth + " " + scaleHeight)
      .attr("role", "img")
      .attr("aria-label", "Color scale: light blue means 0 percent and dark blue means 100 percent");

    const gradient = svg.append("defs").append("linearGradient")
      .attr("id", "opinion-color-gradient")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "0%");

    d3.range(0, 101, 5).forEach((value) => {
      gradient.append("stop")
        .attr("offset", value + "%")
        .attr("stop-color", cellColor(value));
    });

    svg.append("rect")
      .attr("x", 1).attr("y", 3)
      .attr("width", 328).attr("height", 16)
      .attr("rx", 3)
      .attr("fill", "url(#opinion-color-gradient)");

    [0, 25, 50, 75, 100].forEach((percent) => {
      svg.append("text")
        .attr("x", 1 + percent * 3.28)
        .attr("y", 37)
        .attr("text-anchor", percent === 0 ? "start" : percent === 100 ? "end" : "middle")
        .attr("class", "opinion-scale-label")
        .text(percent + "%");
    });
  }

  function render(rows) {
    const byCountry = d3.group(rows, (d) => d.country);
    const value = (country, aspect) =>
      byCountry.get(country).find((d) => d.aspect === aspect).share_pct;

    let countries = [...byCountry.keys()].filter((country) => country !== "Global");
    if (sortElement.value === "alphabetical") {
      countries.sort((a, b) => a.localeCompare(b));
    } else {
      countries.sort((a, b) =>
        (value(b, "My job") - value(b, "Job market")) -
        (value(a, "My job") - value(a, "Job market")) ||
        a.localeCompare(b));
    }
    const orderedCountries = ["Global", ...countries];

    const height = top + orderedCountries.length * (rowHeight + rowGap) + bottom;
    chartElement.replaceChildren();

    const svg = d3.select(chartElement).append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("role", "img")
      .attr("aria-label", "Heatmap comparing expectations that AI will improve personal jobs, the job market, and the national economy across 31 countries plus the published Global aggregate.");

    svg.append("text")
      .attr("class", "opinion-axis-title")
      .attr("x", 10).attr("y", 54)
      .text("Country");

    aspects.forEach((aspect, index) => {
      svg.append("text")
        .attr("class", "opinion-axis-title")
        .attr("x", left + index * (cellWidth + cellGap) + cellWidth / 2)
        .attr("y", 54)
        .attr("text-anchor", "middle")
        .text(aspect.label);
    });

    orderedCountries.forEach((country, index) => {
      const y = top + index * (rowHeight + rowGap);
      const group = svg.append("g").attr("class", country === "Global" ?
        "opinion-global-row" : "opinion-country-row");

      group.append("text")
        .attr("class", "opinion-country-label")
        .attr("x", 10).attr("y", y + rowHeight / 2 + 5)
        .text(country === "Global" ? "Global*" : country);

      aspects.forEach((aspect, col) => {
        const val = value(country, aspect.key);
        const x = left + col * (cellWidth + cellGap);

        const rect = group.append("rect")
          .attr("x", x).attr("y", y)
          .attr("width", cellWidth).attr("height", rowHeight)
          .attr("rx", 3)
          .attr("fill", cellColor(val))
          .attr("tabindex", 0)
          .attr("aria-label", country + ", " + aspect.label + ": " + val +
            " percent expect improvement from AI");

        rect.append("title")
          .text(country + " — " + aspect.label + ": " + val +
            "% expect improvement in the next 3–5 years");

        group.append("text")
          .attr("class", "opinion-cell-label")
          .attr("x", x + cellWidth / 2)
          .attr("y", y + rowHeight / 2 + 5)
          .attr("text-anchor", "middle")
          .attr("fill", val >= 54 ? "#FFFFFF" : "#17252e")
          .attr("pointer-events", "none")
          .text(val + "%");
      });

      if (country === "Global") {
        svg.append("line")
          .attr("class", "opinion-global-separator")
          .attr("x1", 6).attr("x2", width - 6)
          .attr("y1", y + rowHeight + rowGap / 2 + 1)
          .attr("y2", y + rowHeight + rowGap / 2 + 1);
      }
    });

    const greater = countries.filter((c) =>
      value(c, "My job") > value(c, "Job market")).length;
    const equal = countries.filter((c) =>
      value(c, "My job") === value(c, "Job market")).length;
    const lower = countries.length - greater - equal;
    summaryElement.textContent =
      "In " + greater + " of " + countries.length +
      " countries, a higher share expect AI to improve their own job than the wider job market" +
      " (" + lower + " show the opposite; " + equal + " tie)." +
      " These are expectations, not measured changes in employment.";
    statusElement.textContent = "";
  }

  d3.json("data/processed/public_opinion_work.json")
    .then((rows) => {
      validate(rows);
      drawScale();
      sortElement.addEventListener("change", () => render(rows));
      render(rows);
    })
    .catch((error) => {
      console.error("Public opinion heatmap:", error);
      chartElement.replaceChildren();
      statusElement.textContent = "Unable to load public opinion data. Check the JSON file.";
    });
})();
