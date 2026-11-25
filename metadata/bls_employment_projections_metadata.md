# BLS Employment Projections — Dataset Metadata

**Project:** Is AI Really Replacing Us? Exploring the Gap Between Public Perception, AI Capabilities, and Real-World Impact  
**Research area:** Visualizing the Impact of AI  
**Source organization:** U.S. Bureau of Labor Statistics (BLS), Employment Projections  
**Geographic coverage:** United States  
**Base year:** 2025  
**Projection year:** 2035  
**Evidence type:** Official occupational employment projections, occupational characteristics, and qualitative explanations (not observed effects attributable to AI)  
**Metadata status:** Draft — documented from the provided research-table summary; raw BLS tables have **not** been inspected or validated  
**Data file format / last update / license / download file:** Not established from the provided summary; verify against the original BLS data releases.

## 1. Overview and research fit

This metadata document covers **six related BLS tables**, not a single flat dataset. The accompanying source document provides table descriptions, column labels, record counts, and potential research questions. The indicated record counts are counts of HTML data rows according to that document, **not validated counts from downloaded files**.

## Employment Projections Methodology (2025–2035)

### 1. Overview

The U.S. Bureau of Labor Statistics (BLS) develops 10-year employment projections using economic models, historical data, demographic trends, industry forecasts, and expert assessments.

The projections do not simply extrapolate historical employment trends. Instead, they estimate how the U.S. economy, industries, and occupational staffing patterns may evolve over the projection period.

- **Base year:** 2025
- **Projection year:** 2035
- **Geographic coverage:** United States
- **Projection type:** Long-term, structural employment projections
- **Key assumption:** The economy is projected under conditions broadly consistent with full employment, rather than attempting to predict specific future recessions or business cycles.

### 2. Projection Development Process

BLS develops its employment projections through six interconnected stages.

| Stage | Description | Main Factors |
|---|---|---|
| 1. Labor Force | Projects the number of people participating in the labor market. | Population growth, aging, migration, labor force participation |
| 2. Aggregate Economy | Projects overall economic activity and GDP. | Consumption, investment, productivity, government spending |
| 3. Final Demand | Estimates future demand for goods and services. | Consumer demand, business investment, government expenditure, trade |
| 4. Industry Output | Estimates the output required from each industry using input-output relationships. | Industry demand, supply chains, interindustry relationships |
| 5. Industry Employment | Projects the workforce required to produce the expected industry output. | Labor productivity, output growth, wages, technological change |
| 6. Occupational Employment | Distributes projected industry employment across occupations. | Occupational staffing patterns, technological change, industry structure |

The six stages are interconnected, and projections may be revised iteratively to maintain consistency across economic and employment estimates.

### 3. Occupational Employment Estimation

Occupational projections are developed using the **National Employment Matrix**, which describes how employment is distributed across occupations and industries.

BLS estimates future industry employment and then projects how the occupational composition of each industry may change.

Consequently, employment in a particular occupation can increase or decrease because of:

- Changes in overall demand for an industry's products or services.
- Changes in labor productivity.
- Technological developments and automation.
- Changes in the occupational composition of industries.
- Demographic, regulatory, and other structural factors.

Occupational employment projections therefore reflect the combined effects of multiple economic forces rather than a single driver.

### 4. How Artificial Intelligence Is Considered

BLS considers potential AI-related employment impacts when evaluating technological and structural changes affecting occupational demand.

AI may influence employment through several mechanisms:

| Mechanism | Potential Employment Effect |
|---|---|
| Productivity improvements | Fewer workers may be required to produce the same output. |
| Task automation | Some activities previously performed by workers may be automated. |
| Increased demand | Lower costs or new capabilities may increase demand for products and services. |
| Occupational restructuring | The distribution of workers across occupations may change. |
| New tasks and services | Technological developments may create additional labor demand. |

BLS draws on research, industry evidence, government publications, and expert assessments when evaluating potential technological impacts.

**Importantly, AI is not represented as a single, separately reported employment-impact variable for each occupation.** Its potential effects are considered alongside other technological and economic developments.

### 5. Interpretation and Limitations

The following limitations are particularly important when using these projections in research.

**Projections are not observed future outcomes.**

The 2035 values represent modeled estimates based on assumptions about future economic conditions. They are not guaranteed employment outcomes.

**Employment changes cannot be attributed exclusively to AI.**

A projected increase or decrease in occupational employment may reflect demographic, economic, technological, regulatory, and industry-specific developments.

**AI exposure does not necessarily imply job displacement.**

An occupation may be highly exposed to AI technologies while maintaining or increasing employment because of growing demand, complementary tasks, or other factors.

**Employment change is different from job openings.**

An occupation projected to decline may still generate substantial job openings as workers retire or move to different occupations.

**The projections describe employment levels, not changes in individual tasks.**

They do not directly measure which tasks will be automated, augmented, or performed differently through AI.

### 6. Implications for Our Research

**Relevant supporting research questions:**

- **RQ4:** How has employment changed across European occupations, and which U.S. occupations are projected to grow or decline?
- **RQ5:** What contrasts emerge when these separate findings are viewed together, and what remains uncertain about AI-driven job replacement?

Table 1.2 supports comparisons of projected occupational employment growth and decline between 2025 and 2035.

However, the dataset alone cannot establish whether AI causes these changes.

To investigate the relationship between AI and employment more meaningfully, these projections may be compared with:

- Occupational AI-exposure measures.
- Observed AI usage in workplace tasks.
- Historical employment trends.
- Qualitative explanations from BLS Table 1.12 (*Factors Affecting Occupational Utilization*).

Any such comparison should be interpreted as descriptive or correlational unless additional evidence supports causal conclusions.

### 7. Visualization Interpretation

Our visualization compares occupational employment estimates for 2025 with projected employment levels for 2035.

- **2025:** Baseline employment estimate.
- **2035:** Projected employment level.
- **Green:** Projected employment growth.
- **Red:** Projected employment decline.
- **Units:** Thousands of jobs.

Colors indicate the direction of projected employment change, not whether AI has a positive or negative effect on the occupation.

**Suggested visualization note:**

*2035 employment figures are BLS projections based on demographic, economic, industry, and technological assumptions, including potential AI-related impacts. Changes cannot be attributed to AI alone.*

### 8. Official Sources

1. [BLS — Employment Projections Methods Overview](https://www.bls.gov/emp/documentation/projections-methods.htm)
2. [BLS — Artificial Intelligence Impacts on Employment Projections](https://www.bls.gov/emp/factsheets/ai-impacts.htm)
3. [BLS — Factors Affecting Occupational Utilization (Table 1.12)](https://www.bls.gov/emp/tables/factors-affecting-occupational-utilization.htm)
4. [BLS — AI Exposure Categories](https://www.bls.gov/emp/publications/ai-exposure-categories.htm)
5. [BLS — Employment Projections Data Overview](https://www.bls.gov/emp/documentation/data-overview.htm)

| BLS table | Description | Records reported in source document | Main unit of observation | Source link |
|---|---|---:|---|---|
| 1.2 | Occupational projections and worker characteristics | 1,112 | Occupation / occupation group | [BLS Table 1.2](https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm) |
| 1.10 | Occupational separations and openings | 1,112 | Occupation / occupation group | [BLS Table 1.10](https://www.bls.gov/emp/tables/occupational-separations-and-openings.htm) |
| 1.8 | Industry–occupation matrix data, by occupation | 1,112 | Occupation index entry linking to industry detail | [BLS Table 1.8](https://www.bls.gov/emp/tables/industry-occupation-matrix-occupation.htm) |
| 1.9 | Industry–occupation matrix data, by industry | 423 | Industry index entry linking to occupational detail | [BLS Table 1.9](https://www.bls.gov/emp/tables/industry-occupation-matrix-industry.htm) |
| 1.12 | Factors affecting occupational utilization | 935 | Occupation–industry combination, with qualitative description | [BLS Table 1.12](https://www.bls.gov/emp/tables/factors-affecting-occupational-utilization.htm) |

**Relevance to the project proposal:** Primary support for **Supporting Question 4** (U.S. occupational growth/decline projections); contextual support for **Supporting Question 5** (cross-evidence comparisons and uncertainty). These tables do **not** by themselves answer questions about public perceptions (Q1), AI task performance (Q2), or observed AI task use (Q3). They provide **U.S. projections**, not historical European employment measurements.

### Interpretation warning

The tables project employment, transitions, and openings. They do not measure AI adoption at the worker/firm level, establish that changes were caused by AI, or identify the share of a forecast attributable to AI. Avoid framing predicted occupational change as observed AI replacement.

---

## 2. Table 1.2 — Occupational projections and worker characteristics

**Original title:** Occupational projections and worker characteristics  
**Records reported:** 1,112  
**Time coverage:** 2025 baseline; 2035 projections; change for 2025–2035  
**Row meaning:** Occupation or occupational group  
**Structure:** Includes detailed (`Line item`) and aggregate (`Summary`) entries; these must not be added together.

### Data dictionary

| Original column name | Meaning | Expected analytical type | Unit / notes |
|---|---|---|---|
| National Employment Matrix title 2025 | Occupation or occupation-group title | Text / category | Occupational label |
| National Employment Matrix code 2025 | Occupation code | Identifier (text preferred) | Preserve leading zeros and formatting |
| Occupation type | Detailed entry or aggregate | Category | `Line item` or `Summary` per summary document |
| Employment, 2025 | Employment in baseline year | Numeric | Thousands of workers |
| Employment, 2035 | Projected employment | Numeric | Thousands of workers |
| Employment distribution, percent, 2025 | Share of total employment in baseline year | Numeric | Percent |
| Employment distribution, percent, 2035 | Projected share of total employment | Numeric | Percent |
| Employment change, numeric, 2025–35 | Projected change in employment | Numeric | Thousands of workers |
| Employment change, percent, 2025–35 | Projected relative employment change | Numeric | Percent |
| Percent self-employed, 2025 | Self-employed share | Numeric | Percent |
| Occupational openings, annual average | Projected annual occupational openings | Numeric | Thousands per year |
| Median annual wage, 2025 | Median annual wage | Numeric | USD per year |
| Typical education needed for entry | Typical education required to enter occupation | Category | Verify category vocabulary in raw data |
| Work experience in a related occupation | Typical related-work experience requirement | Category | Verify category vocabulary in raw data |
| Typical on-the-job training | Typical workplace training | Category | Verify category vocabulary in raw data |
| Related OOH content | Link to Occupational Outlook Handbook profile | URL / text | Could be empty for some entries; verify |

**Potential analyses:** Rank occupations by projected absolute and percentage growth; compare predefined tech vs. non-tech occupations; examine relationships between growth, education, wages, experience, and self-employment.

**Potential visualizations:** Ranked diverging bar charts for projected change; scatterplot of wage vs. projected growth; filters by occupational grouping, training, or education.

**Limitations:** Projections rather than realized change; correlation is not AI causation; aggregate and detailed rows overlap.

---

## 3. Table 1.10 — Occupational separations and openings

**Original title:** Occupational separations and openings  
**Records reported:** 1,112  
**Time coverage:** 2025–2035 projections, including annual averages  
**Row meaning:** Occupation or occupation group

### Data dictionary

| Original column name | Meaning | Expected analytical type | Unit / notes |
|---|---|---|---|
| National Employment Matrix title 2025 | Occupation title | Text / category | Occupational label |
| National Employment Matrix code 2025 | Occupation code | Identifier (text preferred) | Potential join key |
| Occupation type | Detailed or summary entry | Category | Do not double-count nested aggregates |
| Employment, 2025 | Baseline employment | Numeric | Thousands of workers |
| Employment, 2035 | Projected employment | Numeric | Thousands of workers |
| Employment change, numeric | Projected change in employment | Numeric | Thousands of workers |
| Employment change, percent | Relative projected employment change | Numeric | Percent |
| Labor force exit rate, annual average | Average annual rate of leaving the labor force | Numeric | Rate; confirm exact scale in raw table |
| Occupational transfer rate, annual average | Average annual rate of changing occupation | Numeric | Rate; confirm exact scale in raw table |
| Total occupational separations rate | Overall occupational separation rate | Numeric | Rate; confirm exact scale in raw table |
| Labor force exits, annual average | Estimated people leaving labor force each year | Numeric | Thousands per year |
| Occupational transfers, annual average | Estimated people transferring occupation each year | Numeric | Thousands per year |
| Total occupational separations, annual average | Total estimated annual separations | Numeric | Thousands per year |
| Occupational openings, annual average | Annual opportunities from growth and replacements | Numeric | Thousands per year |

**Potential analyses:** Distinguish net employment growth from replacement demand; examine occupations with declining total employment but continuing annual openings; compare exits and occupational transfers across groups.

**Potential visualizations:** Side-by-side bars showing projected net employment change and annual openings (clearly separated units/time scales); stacked comparisons of exit and transfer counts where arithmetic and categories permit; occupation-level scatterplots.

**Limitations:** Does not show destination occupation or employer-to-employer moves within the same occupation. Annual averages are forecasts, not observed events. Do not treat annual openings and net decade-long change as interchangeable measures.

---

## 4. Table 1.8 — Industry–occupation matrix data, by occupation

**Original title:** Industry–occupation matrix data, by occupation  
**Records reported:** 1,112  
**Row meaning:** One occupation or occupation-group **index entry** pointing to an associated industry-by-occupation matrix.

### Data dictionary — index page only

| Original column name | Meaning | Expected analytical type | Unit / notes |
|---|---|---|---|
| National Employment Matrix title 2025 | Occupation / occupation-group title | Text / category | Occupation identifier by label |
| National Employment Matrix code 2025 | Occupation code | Identifier (text preferred) | Join or lookup key |
| Occupation type | Detailed or summary entry | Category | Level of aggregation |
| National Employment Matrix Link | Link to occupational industry-level projections | URL | Follow for quantitative data |

**Potential analyses after obtaining linked matrices:** Employment by industry for a selected occupation; projected growth by industry; concentration of an occupation across industries.

**Potential visualizations after obtaining linked matrices:** Heatmap of occupation × industry, grouped bars for selected occupations, or industry-distribution views.

**Limitations:** The index itself contains **no quantitative employment columns**. Linked matrix content has not been inspected here. No junior/senior classification.

---

## 5. Table 1.9 — Industry–occupation matrix data, by industry

**Original title:** Industry–occupation matrix data, by industry  
**Records reported:** 423  
**Row meaning:** One industry or industry-group **index entry** pointing to a matrix of occupations within that industry.

### Data dictionary — index page only

| Original column name | Meaning | Expected analytical type | Unit / notes |
|---|---|---|---|
| National Employment Matrix title 2025 | Industry or industry-group title | Text / category | Industry label |
| National Employment Matrix code 2025 | Industry code in matrix | Identifier (text preferred) | Code scheme should be checked |
| Industry type | Detailed or summary entry | Category | Level of aggregation |
| National Employment Matrix Link | Link to occupation-level forecasts within industry | URL | Follow for quantitative data |

**Potential analyses after obtaining linked matrices:** Projected shares of tech occupations within industries; change in occupational composition; comparison of tech-intensive and other industries.

**Potential visualizations after obtaining linked matrices:** Industry-specific occupational composition bars, slope charts for projected changes, and occupation–industry heatmaps.

**Limitations:** Quantitative analysis requires the **linked matrices**, not just the index. Define “tech occupation” and “tech industry” explicitly before comparisons.

---

## 6. Table 1.12 — Factors affecting occupational utilization

**Original title:** Factors affecting occupational utilization  
**Records reported:** 935  
**Row meaning:** Qualitative explanation concerning an occupation–industry pair; the same occupation may occur in several industries.

### Data dictionary

| Original column name | Meaning | Expected analytical type | Unit / notes |
|---|---|---|---|
| National Employment Matrix occupation title 2025 | Occupation title | Text / category | Occupation label |
| National Employment Matrix occupation code 2025 | Occupation code | Identifier (text preferred) | Candidate join field to Table 1.2 |
| National Employment Matrix industry title 2025 | Industry title | Text / category | Industry label |
| National Employment Matrix industry code 2025 | Industry code | Identifier (text preferred) | Candidate join field to industry matrices |
| Factors affecting occupational utilization | Qualitative account of factors affecting an occupation's share within an industry | Free text | May mention automation, AI, productivity, or changes in demand |

**Potential analyses:** Identify explicit references to AI/automation; qualitatively classify described direction of influence; compare descriptions by occupation or industry; link to 1.2 projections at occupation-code level with appropriate caution.

**Potential visualizations:** Searchable table of source passages; counts of *mentions* by themes (clearly labeled as mention counts, not measured effects); connected views of qualitative factors and quantitative occupational projections.

**Limitations:** Not every occupation–industry pair has an explanation; absence of AI terminology does not imply no AI impact. Explanations do not assign a precise proportion of change to any factor. Any keyword or sentiment labels will be **derived analyst variables**, not original BLS columns.

---

## 7. Data relationships and integration

| Source tables | Suggested relation | Key(s) / action | Cautions |
|---|---|---|---|
| 1.2 ↔ 1.10 | Occupation-level projected growth vs. separations/openings | Match occupation code and compatible row granularity | Avoid merging summary rows with detailed rows |
| 1.8 ↔ 1.9 | Alternate index views of occupation–industry data | Download and inspect actual linked matrices | Index pages alone do not permit quantitative analysis |
| 1.2 ↔ 1.12 | Occupation projections vs. qualitative reasons for change | Occupation code, potentially one-to-many | Repeated occupation records in 1.12 can duplicate 1.2 metrics if naively joined |
| 1.9 ↔ 1.12 | Industry composition vs. qualitative explanations | Industry code plus occupation code where available | Check code compatibility and granularity |

**Suggested project-wide cross-source link:** Use the BLS employment findings as the U.S. forecast segment within Supporting Question 4, then compare their *framing* with perception, AI task benchmarks, and observed-use data for Supporting Question 5. Cross-dataset juxtaposition is not proof of causation. European labor trends require a separate European source.

## 8. Research relevance by proposal question

| Supporting question | Relevance | Suitable BLS content | What remains unsupported |
|---|---|---|---|
| **Q1.** U.S. public/expert expectations and cross-country AI concern | Not direct | May provide context for occupational projections | No public-opinion survey results |
| **Q2.** Reliability of AI on planning, coding, professional tasks | Not direct | None of these tables measure AI performance | No benchmark scores or evaluation conditions |
| **Q3.** Tasks automated or augmented in observed AI use | Not direct | Table 1.12 may mention technology qualitatively | No direct observed task-level use measurements |
| **Q4.** European occupation change and projected U.S. occupation growth/decline | **Direct for U.S. projections** | Tables 1.2, 1.10; linked matrices 1.8/1.9 | European observed employment changes require another source |
| **Q5.** Cross-evidence contrasts and uncertainty | **Contextual** | All tables, with Table 1.12 adding qualitative explanations | Cannot attribute employment trends to AI on these data alone |

## 9. Data preparation checklist

- [ ] Download the original BLS data tables (and linked quantitative matrices where needed).
- [ ] Confirm the release period, publication/update date, accessible format, and reuse conditions.
- [ ] Reconcile exact column names, numerical parsing, missing-value markers, and numeric units with downloaded files.
- [ ] Preserve occupation and industry codes as strings.
- [ ] Identify and remove or separately analyze `Summary` rows when using `Line item` rows to avoid double-counting.
- [ ] Verify uniqueness of the relevant keys and identify one-to-many relationships.
- [ ] Define a reproducible tech vs. non-tech occupation/industry classification before creating filters.
- [ ] Ensure annual-average rates/counts are not directly compared with ten-year changes without explicit normalization or separate scales.
- [ ] For Table 1.12, define an auditable text-classification method if coding AI/automation mentions.
- [ ] Record all transformation steps in version-controlled scripts.

## 10. Data quality and provenance — not yet verified

| Item | Status |
|---|---|
| Raw data downloaded and examined | Not yet |
| Column types verified against actual file | Not yet; above types are inferred from descriptions |
| Missing values profiled | Not yet |
| Exact category sets enumerated | Not yet |
| Duplicate records measured | Not yet |
| Key uniqueness established | Not yet |
| Publication/update timestamp confirmed | Not yet |
| 2025–2035 period checked against live BLS source | Not yet; copied from provided summary |
| Numeric data validation performed | Not yet |

## 11. Sources and documentation notes

- **Primary working document:** `LABOR STATISTICS - שאלות מחקר וטבלאות רלוונטיות.docx`, provided by the project team. It contains summaries of the six tables, column glossaries, proposed analyses, and limitations.
- **Original publisher:** [BLS Employment Projections](https://www.bls.gov/emp/).
- **Links to each BLS table:** Listed in Section 1. These were extracted from the supplied document; the live pages have not been independently checked during preparation of this metadata.
- **Data dictionary conventions:** “Expected analytical type” represents a **proposed interpretation**, not a verified CSV/Excel schema. Do not use it as a substitute for schema validation after downloading the actual datasets.

**Documentation principle:** Keep observed data, forecasts, opinion survey responses, task benchmarks, and editorial interpretations separate throughout the site.
