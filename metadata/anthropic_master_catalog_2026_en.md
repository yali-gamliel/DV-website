# Anthropic Economic Index V6 — Master Data Catalog (2026)

**Project:** *Is AI Really Replacing Us?*  
**Main research relevance:** supporting question 3 — *Which occupational tasks are automated or augmented through observed AI use?*  
**Status:** Both June 26, 2026 source files uploaded and profiled on November 25, 2026. The March 2025 work is archived separately and is not pooled with V6.

## 1. Source Inventory

| Dataset | Unit / coverage | Rows | Months | Status |
|---|---|---:|---|---|
| `aei_claude_ai_2026-06-26.csv` | Claude Chat/Cowork, global + country + subregion | **1,636,573** | Apr–May 2026 | Inspected and metadata prepared |
| `aei_1p_api_2026-06-26.csv` | Anthropic first-party API **excluding Claude Code**, global only | **491,705** | Apr–May 2026 | Inspected and metadata prepared |

Both are aggregated **long-format** CSVs with the same ten-column schema and **53 distinct metric IDs**. Each row is one published metric for one period, geography, category, hierarchy level and node. Different source populations must remain differentiated.

## 2. Core Metrics and Definitions

| Metric | Interpretation |
|---|---|
| `pct` | Share of a source/geography's usage attributed to a node in the selected dimension; not share of jobs/workers |
| `collaboration_bucket_automation_pct` | Task/source-specific share assigned automation |
| `collaboration_bucket_augmentation_pct` | Task/source-specific share assigned augmentation |
| Five `collaboration_*` patterns + `collaboration_none_pct` | Separate six-part interaction pattern classification |
| `use_case_work_pct` | Portion classified as work in the corresponding node |

The two **bucket** rates add to approximately 100% for nodes where both are published. Pattern classes are a **separate** scheme; never add patterns to the bucket rates. Percentages may be rounded to two decimals. Missing rows denote nonpublication and are not zeros.

## 3. Verified Data Quality

| Check | Claude Chat/Cowork | API |
|---|---:|---:|
| Total rows | 1,636,573 | 491,705 |
| Columns | 10 | 10 |
| Distinct metrics | 53 | 53 |
| Null cells | 0 | 0 |
| Duplicate metric keys | 0 | 0 |
| May 2026 detailed O*NET nodes with `pct` | 2,713 | 2,295 |
| May 2026 detailed O*NET nodes with both bucket rates | 2,691 | 2,262 |
| Sum of published detailed task `pct`, May | 94.32% | 85.00% |
| May top-ten detailed task `pct` share sum | 20.63% | 20.49% |

**Key:** `date_start`, `date_end`, `geo_id`, `geo_level`, `category_name`, `hierarchy_level`, `metric_id`, `node_external_id`. Zero null cells does **not** imply complete data cubes. Published `pct` values of 0.00 may represent small values rounded down.

## 4. Cross-source Comparison — What It Tells Us

Same month, same O*NET task ID, two **different source populations**. This is a descriptive comparison, **not a causal or representative employment estimate**.

| Metric | April 2026 | May 2026 |
|---|---:|---:|
| O*NET task IDs with published `pct` in *both sources* | 1,577 | 1,815 |
| Tasks with both `pct` and automation in both sources | 1,542 | 1,790 |
| Matched tasks with higher automation in API | 1,515 | 1,753 |
| Matched tasks with lower automation in API | 21 | 27 |
| Equal | 6 | 10 |
| Median unweighted API − Chat automation difference | +37.77 pp | +38.65 pp |

**Concrete May example:** O*NET task `16221` (search electronic sources): `automation` **96.96% API** versus **67.16% Chat**. Its `pct` is **5.72% API**, **4.95% Chat**, but these are shares of **separate source totals**, not comparable absolute counts.

**Interpretation limit:** The strong observed difference may reflect product design, workflows, selected users, task classification and publication thresholds. We cannot infer that APIs cause automation or that a matching occupational task was performed by the same kind of worker in both sources. The unweighted comparison gives every matched task equal importance regardless of task prevalence.

## 5. Research Questions and Visualization Candidates

### A. Primary — How are the most common tasks used?

**100% stacked bar chart (mandatory):** Show the ten highest-published-`pct` O*NET tasks in a selected month and source, with segments for automation vs augmentation. Put `pct` next to task name; bars show task composition, **not prevalence**. A source toggle can switch between Chat and API, but changing source may change the top-ten membership.

### B. Cross-source — Does usage style vary between Chat and API?

**Grouped bar chart (mandatory) or dumbbell plot (extra):** Compare automation levels for the **same matched O*NET task IDs**, source side-by-side, with a fixed month. Recommended if the goal shifts toward the large difference discovered in exploratory analysis. This needs a within-release pivot and matching across the two files, but no raw-data concatenation.

### C. More detailed collaboration mechanisms

**Heatmap (mandatory):** Rows = selected tasks or SOC groups, columns = six collaboration patterns. Show percentage intensity and preserve a clear legend; do not conflate pattern and bucket codes.

### D. Geography or professional fields

Claude Chat/Cowork has geography detail, but API is only global. A source comparison **cannot** be made country by country. SOC occupational groups are a separate category slice in each file; per-task field coloring requires a valid task→occupation crosswalk (not supplied as a direct ID join by these two CSVs).

## 6. Processing Decisions (Not Yet Executed)

1. Decide whether the primary visualization emphasizes **task prevalence/composition** or **Chat vs API comparison**.
2. Choose one month (May 2026 as a suggested default) and one category level (`onet`, level 0).
3. Pivot `metric_id` to named columns by `node_external_id` separately for each source.
4. When comparing sources, inner-match on month and task ID, record coverage and excluded tasks; retain source labels and keep `pct` denominators separate.
5. Produce a small, reproducible JSON/CSV for D3 and retain raw data outside the website bundle if too large.
6. Check all conclusions, labels, disclosure of selection effects, and Github documentation before Pull Request.

## 7. Status and Next Steps

- [x] Source 1: inspect full CSV + Markdown metadata
- [x] Source 2: inspect full CSV + Markdown metadata
- [x] Compare shared task coverage and core automation rates
- [x] Master catalog in English and Hebrew
- [ ] Agree on final visualization(s) with team to avoid overlapping mandatory chart types
- [ ] Prepare derived dataset + reproducible Python script
- [ ] Review source license for publication; official data documentation says CC-BY, repository badge says MIT
- [ ] Open a GitHub feature branch and propose metadata first, visualization code later

## Sources

- https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2026_06_26
- https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data_documentation.md
- Results were calculated from the two uploaded source files; source CSV files are unmodified.
