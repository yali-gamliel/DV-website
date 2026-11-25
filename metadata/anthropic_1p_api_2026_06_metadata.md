# Dataset Metadata — Anthropic Economic Index: First-Party API (June 2026 release)

**Project:** *Is AI Really Replacing Us? Exploring the Gap Between Public Perception, AI Capabilities, and Real-World Impact*  
**Supporting research question 3:** *Which occupational tasks are automated or augmented through observed AI use?*  
**File:** `aei_1p_api_2026-06-26.csv`  
**Status:** Uploaded CSV profiled 2026-11-25; schema and metric definitions cross-checked against Anthropic's official release documentation.

## 1. Dataset Overview

| Field | Verified value |
|---|---|
| Provider | Anthropic — Economic Index V6 |
| Data source | First-party Anthropic API, excluding Claude Code |
| Date coverage | April 2026, May 2026 (calendar months; end date exclusive) |
| Geography | GLOBAL only; not a country-level or subregion-level dataset |
| CSV shape | **491,705 rows × 10 columns** |
| April / May rows | **234,919 / 256,786** |
| Distinct metric identifiers | **53** |
| Categories | O*NET, request, SOC occupation, overall |
| Source files | https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2026_06_26 |
| Official data dictionary | https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data_documentation.md |
| Observation unit | One published metric for one month × geography × analysis category × hierarchy level × category node |
| Interpretation | API usage composition, **not** a census of employees, businesses, jobs replaced or wages |

## 2. Data Dictionary

| Field | Data type | Description / note |
|---|---|---|
| `date_start` | Date string | Inclusive start of monthly sample |
| `date_end` | Date string | Exclusive end of month |
| `geo_id` | String | `GLOBAL` in every API row |
| `geo_level` | String | `global` in every API row |
| `category_name` | Enum | `onet`, `soc_occupation`, `request`, `overall` |
| `hierarchy_level` | Integer | 0 is finest grain in each category; meanings vary by category |
| `metric_id` | String | Identifier for the metric carried by the row |
| `value` | Float | Published value, rounded to two decimals; units depend on metric |
| `node_name` | String | Description of the node, potentially long task statement |
| `node_external_id` | String | Category-specific identifier; preferred for source matching |

**Critical measures:** `pct` is the share of usage attributed to a category node **within the source and geography**, while `collaboration_bucket_automation_pct` and `collaboration_bucket_augmentation_pct` describe the composition of interactions **within that node**. They are not percentages of workers, jobs, or time saved. The five named collaboration patterns plus `collaboration_none_pct` form a different classification scheme from the two bucket rates. The other measures cover use cases, AI autonomy, estimated task time/education, artifacts and request types. Consult the official data documentation for definitions of all metric IDs.

## 3. Dataset Structure and Data Quality

| Audit | Result |
|---|---:|
| Records (all months) | **491,705** |
| Records in `onet` | **314,096** |
| Records in `request` | **106,831** |
| Records in `soc_occupation` | **70,674** |
| Records in `overall` | **104** |
| Null cells across 10 columns | **0** |
| Exact duplicate rows | **0** |
| Duplicate composite metric keys | **0** |
| Minimum / maximum published `value` | **0.00 / 100.00** |

**Validated key within this file:** `date_start + date_end + geo_id + geo_level + category_name + hierarchy_level + metric_id + node_external_id`.

### Global O*NET task level (hierarchy 0)

| Coverage check | April 2026 | May 2026 |
|---|---:|---:|
| Tasks with published `pct` | **1,992** | **2,295** |
| Tasks with both bucket rates | **1,963** | **2,262** |
| Published `pct` sum across level-0 tasks | **81.13%** | **85.00%** |
| Level-0 task shares displayed as `0.00` | **1,041** | **1,274** |
| Maximum bucket sum deviation from 100 | **0.01 pp** | **0.01 pp** |

Published task percentages do **not** sum to 100 because of suppressed / unavailable cells and source rounding. A published `0.00` is not necessarily a true zero. Do not reweight available tasks to 100% without explicitly stating a changed denominator.

### May 2026: ten largest published task shares

| Task (shortened) | `pct` | Automation | Augmentation |
|---|---:|---:|---:|
| Search electronic information sources | 5.72% | 96.96% | 3.04% |
| Review data for quality and completeness | 3.56% | 97.51% | 2.49% |
| Review records to respond to requests | 1.65% | 92.58% | 7.42% |
| Identify and document program problems | 1.62% | 95.98% | 4.02% |
| Examine documents/materials for standards conformance | 1.45% | 86.06% | 13.94% |
| Write or modify programs | 1.35% | 87.78% | 12.22% |
| Answer customer inquiries about procedures | 1.34% | 94.84% | 5.16% |
| Locate unusual information for specific requests | 1.33% | 98.18% | 1.82% |
| Edit or rewrite written material | 1.32% | 97.32% | 2.68% |
| Classify and assign headings to materials | 1.15% | 99.76% | 0.24% |

Top-ten published shares sum to **20.49%**. Task labels are abbreviated here; preserve exact `node_name` strings in analytical data.

## 4. Research Relevance

**Primary:** Research question 3, describing observed task-level automation and augmentation in API use.  
**Secondary:** Research question 5, contrasting separate findings while acknowledging uncertainty about job replacement.

The API source is particularly useful for comparison with the Claude Chat/Cowork source: the datasets have compatible schema and month labels but represent **different user populations, usage settings and sampling frames**. Distinct task-level percentages are internally normalized in each source; **do not add the two sets of percentages, and do not treat aggregate usage share as comparable absolute volume**.

On the same task (searching electronic sources, O*NET node `16221`), May 2026 automation is **96.96% in API** vs **67.16% in Chat/Cowork**. This difference does not demonstrate causation.

For May 2026, **1,790** task IDs have both `pct` and automation measures in both sources; API automation exceeds Chat/Cowork for **1,753** of these tasks, is lower for **27**, and equal for **10**. The *unweighted task-level* median API-minus-Chat difference is **38.65 percentage points**. This is **not** a usage-weighted population effect and is subject to selection and publication thresholds.

## 5. Potential Visualizations

1. **100% stacked bar chart (mandatory):** Compare automation and augmentation for the API's ten highest-share O*NET tasks, with task `pct` as a separate label. No cross-source join required.
2. **Grouped bar / dumbbell (mandatory/extra):** Compare automation percentages in *matched O*NET tasks* between API and Chat/Cowork for a fixed month. Requires matching by node ID and preselecting common published tasks; it is descriptive, not causal.
3. **Heatmap (mandatory):** Compare the six *pattern* classes (directive, feedback loop, task iteration, learning, validation, none) across selected tasks. Do not mix with bucket rates as though all eight parts add to 100.

## 6. Limitations and Interpretation

- API usage is **not** representative of all firms or all AI products; **Claude Code is excluded** from this source.
- Data are published at aggregate category level. The file does not provide individual conversations or absolute sample sizes per task.
- Missing metric-node combinations are suppressed/unpublished, **not zero**.
- The two month snapshots do not establish a long-term trend.
- The observed API vs Chat difference reflects different source populations and potentially different workflows; it does not isolate an API-interface effect.
- O*NET task assignments are model-classified, not verified employment status or displacement.
- Source documentation states CC-BY while repository badge may show MIT; check licensing before redistribution.

## 7. Data Preparation and Integration

- [x] Inspect full CSV, schema, category counts, month coverage, nulls and duplicate keys.
- [x] Validate bucket and collaboration-pattern sums within rounding tolerance.
- [x] Inspect top ten task shares for May and verify metrics coverage.
- [x] Calculate matching coverage with Chat/Cowork on O*NET task IDs.
- [ ] Choose the figure and month before generating any processed file.
- [ ] Filter **one source + one month + `category_name=onet` + `hierarchy_level=0`**; pivot `metric_id` into columns by `node_external_id`.
- [ ] For a cross-source comparison, join **only matched task IDs and months** and explicitly record excluded rows.
- [ ] Decide whether to show raw task composition or a selected set of tasks; do not interpret filtered sample as labor market shares.
- [ ] Validate processed CSV/JSON outputs and write reproducible pandas script before GitHub PR.

## Sources and Verification

- Anthropic Economic Index V6 dataset: https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2026_06_26
- Official source schema and metrics: https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data_documentation.md
- Verification: computed locally from uploaded `aei_1p_api_2026-06-26.csv` and `aei_claude_ai_2026-06-26.csv` on 2026-11-25.
