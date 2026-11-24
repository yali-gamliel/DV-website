# Dataset Metadata — BLS OEWS Annual “All Data” Files (2016–2025)

**Project:** *Is AI Really Replacing Us? Exploring the Gap Between Public Perception, AI Capabilities, and Real-World Impact*  
**Source:** U.S. Bureau of Labor Statistics (BLS), Occupational Employment and Wage Statistics (OEWS; formerly OES)  
**Dataset scope:** **Only** the annual **All data** downloads for **May 2016 through May 2025** (10 annual releases). Other OEWS tables, occupation profiles, research estimates, and special-purpose data sets are outside this metadata's scope.  
**Official index:** https://www.bls.gov/oes/tables.htm  
**Source documentation:** https://www.bls.gov/oes/oes_doc.htm  
**Historical documentation:** https://www.bls.gov/oes/oes_doc_arch.htm  
**Accessed / checked:** 2026-11-18  
**Status:** Source index and archive URLs verified; actual ZIP contents and year-by-year schemas **not directly inspected**. Schema details below are a *working cross-year data dictionary*, not a claim that all fields appear in every annual file.

## 1. Year-by-Year File Inventory

The index labels each download **“All data (XLSX)”**; clicking it leads to a **ZIP archive** containing the spreadsheet data. Use the official archive for the corresponding year.

| Reference year | Release label | Official All Data ZIP | Format linked on index | Number of records (fill in) | Number of columns (fill in) |
|---|---|---|---|---|---|
| 2016 | May 2016 | [oesm16all.zip](https://www.bls.gov/oes/special-requests/oesm16all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2017 | May 2017 | [oesm17all.zip](https://www.bls.gov/oes/special-requests/oesm17all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2018 | May 2018 | [oesm18all.zip](https://www.bls.gov/oes/special-requests/oesm18all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2019 | May 2019 | [oesm19all.zip](https://www.bls.gov/oes/special-requests/oesm19all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2020 | May 2020 | [oesm20all.zip](https://www.bls.gov/oes/special-requests/oesm20all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2021 | May 2021 | [oesm21all.zip](https://www.bls.gov/oes/special-requests/oesm21all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2022 | May 2022 | [oesm22all.zip](https://www.bls.gov/oes/special-requests/oesm22all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2023 | May 2023 | [oesm23all.zip](https://www.bls.gov/oes/special-requests/oesm23all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2024 | May 2024 | [oesm24all.zip](https://www.bls.gov/oes/special-requests/oesm24all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |
| 2025 | May 2025 | [oesm25all.zip](https://www.bls.gov/oes/special-requests/oesm25all.zip) | XLSX (via ZIP) | `TODO` | `TODO` |

**To complete:** Replace each `TODO` with the verified count from the corresponding annual All Data workbook. Count data records only (exclude header rows, notes, and documentation sheets). If there are multiple data sheets, specify which sheet(s) were counted.

**Important:** There is no implication that these files are CSVs or that all 10 archives share exactly the same columns. Record counts, sheet names, missing-value counts, and file sizes require downloading and inspecting each archive. Do not invent them.

## 2. Dataset Overview

| Property | Description |
|---|---|
| Evidence type | Observed / survey-based **estimates** of occupational employment and wages; neither AI-adoption measures nor future employment projections |
| Temporal coverage | Ten annual May reference periods: 2016–2025; not monthly observations or an individual-worker panel |
| Geography | United States: national, states, and metropolitan/nonmetropolitan areas, subject to release-specific availability and definitions |
| Categories | Occupations classified under the Standard Occupational Classification (SOC); industry categories use NAICS where applicable |
| Metrics | Estimated occupational employment, hourly/annual wage levels and percentiles, selected concentration and statistical precision indicators |
| Unit of observation | Typically an occupation × geographic area × industry/ownership grouping within a particular year; some rows are summary categories rather than detailed occupations |
| Frequency | Annual published estimates (each May reference period) |
| Population / scope | Wage and salary employment in occupations covered by OEWS; not a complete census of every worker and not a direct measure of the self-employed |
| Number of records | Fill in the year-by-year inventory above after counting data rows (excluding headers and notes) |
| Number of columns | Fill in the year-by-year inventory above after inspecting each workbook |

## 3. Working Data Dictionary — Annual All Data Files

The fields below describe the commonly encountered **OEWS All Data** schema. **They must be reconciled against each downloaded workbook individually** because column availability, labels, order, coding, and suppression conventions can change over time.

### 3.1 Geography, industry and occupation identifiers

| Field | Meaning | Expected type | Notes |
|---|---|---|---|
| `AREA` | Geographic area code | String | Preserve leading zeros; code system may change by geography/year |
| `AREA_TITLE` | Area name | String | Useful display label; not a stable joining key |
| `AREA_TYPE` | Geography category | Category / code | E.g., national, state, metropolitan/nonmetropolitan; verify release's codebook |
| `PRIM_STATE` | Associated state abbreviation/code | String | May not identify every state in multistate areas |
| `NAICS` | Industry code | String | Preserve leading zeros; may indicate cross-industry aggregate |
| `NAICS_TITLE` | Industry label | String | Cross-industry is not a distinct industry |
| `I_GROUP` | Industry aggregation/group designation | Category | Check values in each year |
| `OWN_CODE` | Ownership category code | String | Check definitions before grouping or combining |
| `OCC_CODE` | Occupation (SOC) code | String | Keep as string with dashes; codes/definitions evolve |
| `OCC_TITLE` | Occupation label | String | Use code and classification crosswalk, not just label, for longitudinal matching |
| `O_GROUP` | Occupation hierarchy level | Category | Examples include `total`, `major`, `minor`, `broad`, `detailed`; not all levels necessarily present in each file |

### 3.2 Employment and occupational concentration

| Field | Meaning | Expected type | Unit / interpretation |
|---|---|---|---|
| `TOT_EMP` | Estimated employment in row's occupation/geography/industry grouping | Numeric / suppressed | **Workers (persons), not thousands** |
| `EMP_PRSE` | Employment percent relative standard error | Numeric / suppressed | Percent; approximate indicator of estimate precision |
| `JOBS_1000` | Jobs in the occupation per 1,000 jobs in the reference grouping | Numeric / suppressed | Per 1,000 jobs |
| `LOC_QUOTIENT` | Location quotient / relative occupational concentration | Numeric / suppressed | Ratio, dimensionless; interpret relative to national concentration per BLS definition |
| `PCT_TOTAL` | Percent of employment represented by occupation in grouping | Numeric / suppressed | Percent; availability varies |

### 3.3 Wage distribution

| Field | Meaning | Expected type | Unit |
|---|---|---|---|
| `H_MEAN` | Mean hourly wage | Numeric / suppressed | USD per hour |
| `A_MEAN` | Mean annual wage | Numeric / suppressed | USD per year |
| `MEAN_PRSE` | Percent relative standard error for mean wage | Numeric / suppressed | Percent |
| `H_PCT10` | 10th-percentile hourly wage | Numeric / suppressed | USD/hour |
| `H_PCT25` | 25th-percentile hourly wage | Numeric / suppressed | USD/hour |
| `H_MEDIAN` | Median hourly wage | Numeric / suppressed | USD/hour |
| `H_PCT75` | 75th-percentile hourly wage | Numeric / suppressed | USD/hour |
| `H_PCT90` | 90th-percentile hourly wage | Numeric / suppressed | USD/hour |
| `A_PCT10` | 10th-percentile annual wage | Numeric / suppressed | USD/year |
| `A_PCT25` | 25th-percentile annual wage | Numeric / suppressed | USD/year |
| `A_MEDIAN` | Median annual wage | Numeric / suppressed | USD/year |
| `A_PCT75` | 75th-percentile annual wage | Numeric / suppressed | USD/year |
| `A_PCT90` | 90th-percentile annual wage | Numeric / suppressed | USD/year |
| `ANNUAL` | Flag associated with occupations whose wages are reported on an annual basis | Categorical flag | Interpret using year-specific BLS documentation |
| `HOURLY` | Flag associated with hourly wage publication | Categorical flag | Interpret using year-specific BLS documentation |

**Missing and non-numeric values:** Suppression and special-value markers must be decoded using the relevant BLS release notes, rather than automatically treating all non-numeric values as zero. Historical files may have additional or differently named columns: record those in a year-specific schema audit before building a combined data set.

## 4. Dataset Structure and Joining Across Years

A proposed *analysis-level* key is:

`year + AREA + AREA_TYPE + NAICS + OWN_CODE + OCC_CODE + O_GROUP`

This is **not verified as a unique primary key**. Test uniqueness after import and expand/revise the key if necessary. Never sum `total` / `major` / `minor` / `broad` rows together with `detailed` occupation rows: this would double count employment.

**Recommended import process:**
1. Download and unzip the **10 linked All Data archives only**.
2. Inspect each workbook's actual sheet names and header row; identify non-data documentation sheets.
3. Add a `year` field derived from the official May release, not from row order.
4. Record source file, original column name, cleaned name, and value type in a per-year schema audit.
5. Normalize text, keys, suppression markers, and numeric formats; retain raw untouched files.
6. Select one consistent occupational detail level, geographic level, industry aggregation, and ownership definition for each analysis.
7. Check occupation classifications and geographic boundaries before matching the same occupation or area across years.
8. Produce a longitudinal analysis table only after reconciling incompatible codes and definitions.

## 5. Relevance to the Research Proposal

### Primary match — Supporting Question 4

> **How has employment changed across European occupations, and which U.S. occupations are projected to grow or decline?**

OEWS **All Data** can help describe **historical U.S. occupational employment and wages** between 2016 and 2025, as useful additional U.S. context. It **does not** describe European employment and **does not** directly provide U.S. forward projections (those require BLS Employment Projections data).

### Secondary match — Supporting Question 5

> **What contrasts emerge when these separate findings are viewed together, and what remains uncertain about AI-driven job replacement?**

OEWS provides observed employment context to compare *narratively* with AI perceptions, technical performance, and AI-use evidence. Do not present a co-occurring employment change as proof of AI causation.

### Not directly answered by these data

- Q1: Public/expert expectations and international concern (needs surveys).
- Q2: AI reliability at planning, coding, professional tasks (needs benchmarks/experiments).
- Q3: Tasks automated vs augmented via observed AI use (needs task-/usage-level evidence).

## 6. Suggested Analyses and Visualizations

| Proposed visualization | Suggested fields | Cautions |
|---|---|---|
| Time-series lines for selected tech occupations (2016–2025) | `year`, `OCC_CODE`, `TOT_EMP` | Filter to comparable national, cross-industry, detailed occupations and harmonize SOC classifications |
| Occupation rankings by employment change (e.g., 2019 vs 2025) | `TOT_EMP`, `OCC_TITLE`, `year` | Use percentage and absolute differences; require consistent categories |
| Wage trends by occupation | `A_MEDIAN` or `A_MEAN`, `year` | Nominal USD must be adjusted for inflation for real wage comparison |
| Geographic concentration map | `AREA`, `OCC_CODE`, `LOC_QUOTIENT`, `year` | Area boundaries and occupational definitions may differ by year |
| Employment vs wage change scatterplot | `TOT_EMP`, `A_MEDIAN`, `OCC_CODE`, `year` | Correlation is not evidence of AI-related displacement |
| Before/after 2022 visual comparison | `year`, `TOT_EMP`, `OCC_CODE` | 2022 is contextual, **not a valid causal intervention identifier** on its own |

**Suggested website annotation:** “These estimates show employment and wage patterns; they do not identify whether AI caused observed changes.”

## 7. Limitations and Comparability Risks

1. **Not causal:** Employment changes reflect many influences beyond AI (economic cycles, demographics, industry mix, regulation, pandemics, etc.).
2. **Not demand / vacancies:** `TOT_EMP` is estimated employment, **not** job postings or unfilled positions; employment declines do not directly measure layoffs.
3. **Not a complete workforce census:** Coverage and the treatment of self-employed workers are limited by the OEWS survey universe.
4. **Classification breaks:** SOC occupational definitions, industry classifications, and publication practices can vary across 2016–2025. A longitudinal crosswalk or restricted set of comparable occupations may be needed.
5. **Geographic changes:** Metro definitions and published areas can change; a stable geographical unit is preferable when charting trends.
6. **Survey estimation:** Published counts are estimates, and sampling/reliability measures matter; not individual-level longitudinal employment histories.
7. **Wage interpretation:** Annual and hourly wage measures may not exist for all jobs. Published annual wages are not automatically a measure of individual annual earnings; inflation affects nominal trends.
8. **Suppression:** Some fields may contain undisclosed/suppressed values rather than numeric data.
9. **Overlapping categories:** Including both occupational totals and constituent categories in a sum causes double counting; different industry and geographic aggregations also overlap.
10. **Longitudinal method changes:** Consult year-specific technical notes, especially around the pandemic period and methodological/classification changes, before interpreting discontinuities.

## 8. Data Preparation Status / To Verify

| Check | Status |
|---|---|
| Identify exactly ten annual All Data links (2016–2025) | **Verified from official index** |
| Verify target ZIP URLs are linked from year headings | **Verified from official index** |
| Download/unzip every archive | **Not performed** |
| Inspect all actual workbooks and column names | **Not performed** |
| Verify row/column counts by year | **Not performed** |
| Enumerate missing/suppression codes | **Not performed** |
| Determine exact uniqueness key | **Not performed** |
| Map cross-year SOC / NAICS / geography classifications | **Not performed** |
| Choose longitudinal analysis filters | **Not yet decided** |
| Create inflation-adjusted wage measures | **Not performed** |

**Recommended first analytic subset:** National (`U.S.`), cross-industry, detailed occupations, with a consistent ownership rule, in annual files 2016–2025. Verify that all target occupations are comparable before reporting changes.

## 9. Official References

- [OEWS tables: annual All Data downloads](https://www.bls.gov/oes/tables.htm)
- [Current OEWS documentation](https://www.bls.gov/oes/oes_doc.htm)
- [OEWS historical documentation archive](https://www.bls.gov/oes/oes_doc_arch.htm)
- [OEWS frequently asked questions](https://www.bls.gov/oes/oes_ques.htm)
- [OEWS Handbook of Methods — concepts](https://www.bls.gov/opub/hom/oews/concepts.htm)

*This document intentionally excludes metadata for every other OEWS download type.*
