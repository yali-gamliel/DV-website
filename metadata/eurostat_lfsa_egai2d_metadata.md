# Dataset Metadata — Eurostat: Employed Persons by Detailed Occupation (ISCO-08, Two-Digit Level)

**Project:** *Is AI Really Replacing Us? Exploring the Gap Between Public Perception, AI Capabilities, and Real-World Impact*  
**Dataset identifier:** `lfsa_egai2d`  
**Documentation status:** Source-level metadata verified; exact custom-view settings and downloaded-file statistics require confirmation.

## 1. Dataset Overview

| Field | Value |
|---|---|
| Dataset name | Employed persons by detailed occupation (ISCO-08 two digit level) |
| Provider | Eurostat — Statistical Office of the European Union |
| Underlying source | European Union Labour Force Survey (EU-LFS), detailed annual results |
| Dataset code | `lfsa_egai2d` |
| User-provided view | https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d__custom_24306250/default/table |
| Full dataset | https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d/default/table |
| DOI | https://doi.org/10.2908/lfsa_egai2d |
| Dataset coverage | 2011–2025 (as reported by Eurostat on 2026-11-18) |
| Recommended project period | 2016–2025, for a ten-year comparison; retain earlier years if analytically useful |
| Last data update shown by Eurostat | 2026-09-10 |
| Last structure update shown by Eurostat | 2026-04-17 |
| Frequency | Annual (`A`) |
| Geographic coverage | European reporting countries and selected aggregates; exact selected countries: **TODO** |
| Occupational classification | ISCO-08, primarily two-digit occupational groups |
| Unit | Thousand employed persons (`THS_PER`) |
| Evidence type | Observed/survey-estimated historical employment, **not projections** |
| Number of records in downloaded file | **TODO — fill after download** |
| Number of columns in downloaded file | **TODO — fill after download** |
| File format used in project | **TODO — CSV / TSV / XLSX / other** |
| Date accessed/downloaded | **TODO** |

**Scope note:** The exact filters and layout of the user's specific `__custom_24306250` view could not be read reliably from the web interface. The definitions below describe the underlying `lfsa_egai2d` dataset; confirm the selected age, sex, countries, occupations, and years in the downloaded export.

## 2. Data Dictionary

This is a **dimensional statistical dataset**, not a conventional dataset with one fixed meaning per spreadsheet column: the exported column names and layout depend on the chosen export option (flat table vs formatted pivot table).

| Dimension / field | Meaning | Expected data type | Unit / example | Notes |
|---|---|---|---|---|
| `freq` | Statistical reporting frequency | Categorical code | `A` = annual | Constant in this dataset |
| `unit` | Measurement unit | Categorical code | `THS_PER` = thousand persons | Multiply by 1,000 to estimate people |
| `age` | Age group | Categorical code | e.g., `Y15-64` = ages 15–64 | Check selected age group in export |
| `sex` | Sex category | Categorical code | `T` = total, plus female/male categories | Check selected categories |
| `isco08` | Occupation classification | Categorical code | ISCO-08 two-digit occupational codes | May also include aggregate groups and special categories; avoid double-counting |
| `geo` | Reporting country or aggregate | Categorical code | e.g., `IT`, `DE`, `EU27_2020` | EU aggregate is not an additional country |
| `TIME_PERIOD` / `time` | Reference year | Integer or year-string | 2016, 2017, …, 2025 | Exact column label depends on download format |
| `OBS_VALUE` / value cells | Estimated employed persons | Numeric | 123.4 (thousand people) | Not a count of job postings or vacancies |
| `OBS_FLAG` / observation flags | Data-quality or status annotations | Categorical/text | e.g., `u` for low reliability | May be embedded beside values in spreadsheet-style exports |

**Fields to inspect after download:** Exact column headers: **TODO**; all category values and labels: **TODO**; missing-value tokens: **TODO**; additional flags/annotations: **TODO**.

## 3. Dataset Structure

### Unit of observation

In a long/flat representation, a row corresponds to one **year × geographic area × ISCO-08 occupation × age group × sex category**, with frequency and unit dimensions. Its numeric value is an estimate of employed persons in **thousands**.

**Suggested unique composite key:** `freq + unit + age + sex + isco08 + geo + time` (verify against the actual export).

### Data size and completeness (to fill)

| Item | Value |
|---|---|
| Downloaded records, all years | **TODO** |
| Downloaded columns | **TODO** |
| Records by year (2016–2025) | **TODO** |
| Distinct countries / geographic codes | **TODO** |
| Distinct occupation codes | **TODO** |
| Missing or suppressed values by year | **TODO** |
| Rows carrying reliability flags | **TODO** |
| Duplicate composite keys | **TODO** |

**Important:** Eurostat's published *number of cells* is not equivalent to the row count of a particular downloaded file or custom view. Do not treat the full dataset's cell count as the number of project records.

### Important structural cautions

- Do not add occupation `Total` or higher-level aggregate rows to the individual two-digit occupation categories.
- Do not add EU/Euro area aggregates to their member-country totals.
- Avoid combining total sex/age categories with their respective components when summing.
- Preserve observation flags and record unavailable cells as missing, **not zero**.
- Verify comparability across countries and years, particularly methodological changes and possible series breaks.

## 4. Research Relevance

**Primary research question 4:** “How has employment changed across European occupations, and which U.S. occupations are projected to grow or decline?”

This dataset directly addresses the **European historical employment** portion of question 4. It can show changes in estimated employment by detailed occupational group and country, before and after 2022. It does **not** directly measure AI adoption, automation, layoffs, causality, or future job growth.

**Secondary research question 5:** “What contrasts emerge when these separate findings are viewed together, and what remains uncertain about AI-driven job replacement?”

This dataset can be presented alongside (but not treated as directly equivalent to) U.S. BLS historical employment and projections, AI-exposure/task-use data, public perceptions, and AI performance benchmarks.

### Suggested measures

| Measure | Suggested definition | Interpretation |
|---|---|---|
| Employment level | `OBS_VALUE` | Employed persons, in thousands |
| Absolute employment change | `employment_t - employment_baseline` | Change in thousands of workers |
| Percentage change | `(employment_t / employment_baseline - 1) * 100` | Percentage change; undefined if baseline is zero/missing |
| Employment index | `(employment_t / employment_baseline) * 100` | Baseline normalized to 100 |
| Occupation share in employment | `occupation_employment / total_employment * 100` | Requires matching country/year/sex/age filters and non-overlapping occupation categories |
| Pre-/post-2022 descriptive trend | Compare 2016–2021 and 2022–2025 | Descriptive association only, not an AI causal effect |

## 5. Potential Visualizations

1. **Interactive line chart:** Estimated employment by occupation over 2016–2025, filtered by country.
2. **Heatmap:** Percentage change in employment from a selected baseline to 2025, by country and occupation.
3. **Ranked diverging bar chart:** Occupations with the largest employment gains and losses (absolute or relative).
4. **Small multiples:** Employment trend for a selected ISCO-08 group across European countries.
5. **Indexed comparison:** Compare occupational trends with a common baseline of 100 to reduce distortions from country size.
6. **Annotated 2022 reference line:** Mark the broad generative-AI adoption period without implying a causal discontinuity.

For cross-country comparison, prefer indexed trends or percentage changes where appropriate. Keep absolute levels available to show scale.

## 6. Limitations and Interpretation

- **Not a causal AI dataset.** Changes in occupational employment cannot be attributed exclusively to AI; business cycles, demographics, COVID-19, education, policy, and other technologies may contribute.
- **Survey estimates, not administrative headcounts.** EU-LFS estimates are subject to sampling and non-sampling uncertainty.
- **Not job vacancies or hiring demand.** The metric is estimated employed persons, not advertised positions.
- **Two-digit occupation detail limits specificity.** Many distinct tech and non-tech roles may share a broader occupation group; individual software specializations or junior/senior status cannot be identified here.
- **Missing data and reliability flags matter.** Small occupational groups in smaller countries may have unavailable or low-reliability estimates.
- **Comparability is not automatic.** Changes in survey methodology or country coverage can affect historical comparisons.
- **Country/aggregate overlap.** European aggregates and their member states must not be summed together.
- **Custom view vs source dataset.** Exact selections in the shared custom view must be verified manually in the export.

## 7. Data Preparation and Integration

### Required before analysis

- [ ] Download the chosen custom view or full dataset and record its export format and date.
- [ ] Confirm that the project uses **2016–2025** and document any excluded years.
- [ ] Record the exact age and sex selections and keep them consistent across comparisons.
- [ ] Choose which geographic entities to use; separate countries from EU and Euro area aggregates.
- [ ] Keep only the desired detailed ISCO-08 occupational codes; verify whether total/aggregate rows are present.
- [ ] Convert occupation and geographic codes to descriptive labels using official code lists.
- [ ] Convert employment values to numeric and retain reliability/status flags.
- [ ] Count records, columns, unique codes, missing values, and flagged values; populate the TODO table.
- [ ] Create year-over-year and baseline change metrics using explicit formulas.
- [ ] Check official Eurostat methodology notes for breaks in comparability before interpreting trends.

### Cross-dataset integration

- **U.S. BLS OEWS All Data:** Compare country-specific occupational trends at a *conceptual* level; ISCO-08 and U.S. SOC are **different classification schemes** and require a defensible crosswalk, not direct code matching.
- **U.S. BLS Employment Projections:** Contrast historical European trends with **projected** U.S. outcomes; clearly label historical vs future estimates.
- **AI capability / task datasets:** Connect occupation groups to AI task exposure only when a documented task-to-occupation mapping is available.

## Sources and Verification

1. Eurostat dataset (`lfsa_egai2d`): https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d/default/table
2. User's custom Eurostat table: https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d__custom_24306250/default/table
3. Eurostat DOI: https://doi.org/10.2908/lfsa_egai2d
4. EU-LFS reference metadata: https://dgs-p.eige.europa.eu/data/metadata/ta_wrklab_lab_employ__lfsa_egai2d

**Verification note (2026-11-18):** Dataset title, code, annual frequency, dimensions, units, coverage through 2025, and data-update information were checked from publicly indexed Eurostat information. Exact contents and selected filters of the user's unique custom table, as well as exported row/column counts, were **not** directly verifiable and are marked **TODO** where relevant.
