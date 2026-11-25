# Dataset Metadata — Anthropic Economic Index: Claude AI (June 2026 release)

**Project:** *Is AI Really Replacing Us? Exploring the Gap Between Public Perception, AI Capabilities, and Real-World Impact*  
**Supporting question 3:** *Which occupational tasks are automated or augmented through observed AI use?*  
**Dataset file:** `aei_claude_ai_2026-06-26.csv`  
**Documentation status:** Uploaded file fully profiled (2026-11-25); official schema and metric definitions verified. The separate API CSV has now been inspected; see `anthropic_1p_api_2026_06_metadata.md` for separate source-level findings.

## 1. Dataset Overview

| Field | Verified value |
|---|---|
| Provider | Anthropic |
| Dataset | Anthropic Economic Index — Claude Chat / Cowork |
| Release | June 26, 2026, V6 |
| Source | https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2026_06_26 |
| Official documentation | https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data_documentation.md |
| Scope | Claude Chat and Cowork (Free/Pro/Max), *not* the 1P API source |
| Dates in CSV | April 1–30 and May 1–31, 2026 (date_end exclusive) |
| Unit of observation | One published metric for one month × geography × category × level × node |
| Observed rows × columns | 1,636,573 × 10 |
| Number of metrics | 53 |
| File format | CSV, long-format aggregated data |
| Geographies | Global, countries and subregions |
| Attribution caveat | Usage patterns, **not** direct displacement, worker counts, or causal employment effects |
| License note | Source file documentation says CC-BY; repository-level badge says MIT. Verify reuse terms before publication. |

## 2. Data Dictionary

| Column | Type | Meaning / important caveat |
|---|---|---|
| `date_start` | Date string | Start inclusive (April or May 2026) |
| `date_end` | Date string | End exclusive |
| `geo_id` | String | `GLOBAL`, country or subregion code |
| `geo_level` | Enum | `global`, `country`, `subregion` |
| `category_name` | Enum | `onet`, `soc_occupation`, `request`, `overall` |
| `hierarchy_level` | Integer | 0 = finest level. For O*NET level 0 means task; for SOC level 0 detailed occupation |
| `metric_id` | String | Metric identifier; metrics are rows, *not columns* |
| `value` | Float | Published value rounded to two decimals; units depend on metric |
| `node_name` | String | Node's human-readable description |
| `node_external_id` | String | Stable category-specific source identifier; prefer to names for matching |

### Research-critical metrics

| Metric | Unit | Meaning |
|---|---|---|
| `pct` | % | Share of geography's total usage in this category node (not employment share) |
| `collaboration_bucket_automation_pct` | % | Automation classification within a node |
| `collaboration_bucket_augmentation_pct` | % | Augmentation classification within a node |
| `collaboration_directive_pct` | % | Directive collaboration pattern |
| `collaboration_feedback_loop_pct` | % | Feedback-loop collaboration pattern |
| `collaboration_task_iteration_pct` | % | Iterative collaboration pattern |
| `collaboration_learning_pct` | % | Learning pattern |
| `collaboration_validation_pct` | % | Validation pattern |
| `collaboration_none_pct` | % | None classification for **pattern** scheme; not a residual bucket for Automation/Augmentation |
| `use_case_work_pct` | % | Share classified as work use within the corresponding node |

Other metrics include request types, autonomy, estimated time and education, usage per capita, and artifact outputs. See official source for all 53 identifiers and the supporting `eda_quality_report.json` for observed frequencies.

## 3. Dataset Structure and Data Quality

| Check | Result |
|---|---:|
| Rows, April | 743,769 |
| Rows, May | 892,804 |
| Global rows | 554,941 |
| Country rows | 673,272 |
| Subregion rows | 408,360 |
| O*NET rows | 744,544 |
| SOC rows | 353,817 |
| Request-topic rows | 465,202 |
| Overall rows | 73,010 |
| Missing values across all 10 columns | 0 |
| Exact duplicate rows | 0 |
| Duplicate composite metric keys | 0 |

**Validated row key (within this export):** `date_start`, `date_end`, `geo_id`, `geo_level`, `category_name`, `hierarchy_level`, `metric_id`, `node_external_id`.

The dataset has zero *null cells*, but **not every possible metric-node combination is present**. Missing records are unpublished/suppressed, not measured zero. Source values are rounded (some tiny published shares are `0.00`). Do not interpret `pct=0.00` as proof of zero underlying usage.

### Global detailed O*NET task coverage (hierarchy level 0)

| Coverage | April 2026 | May 2026 |
|---|---:|---:|
| Nodes with `pct` | 2,410 | 2,713 |
| Nodes with both automation and augmentation | 2,380 | 2,691 |
| Sum of published, **rounded** `pct` values | 88.40% | 94.32% |
| Nodes with `pct=0.00` (rounded) | 1,304 | 1,566 |
| Top-10 tasks' share (published values) | 19.54% | 20.63% |

The sum of task-level shares is **not 100%**. This is not proof of a calculation error: suppression, incompleteness, and the many zero-rounded published values make complete coverage and recomputation impossible from this CSV alone. Do not renormalize shares to 100% without a documented analytical reason.

For nodes with both buckets, automation + augmentation differs from 100 by at most **0.01 percentage point** (rounding), with no larger discrepancies. The five detailed collaboration patterns + `collaboration_none_pct` sum to approximately 100% where all six are published (max difference 0.02 point). **Do not add** `collaboration_none_pct` to the two-bucket automation/augmentation total.

### Cross-month comparability

- 2,300 detailed task IDs appear in both April and May; 110 only in April; 413 only in May.
- 2,274 shared IDs have automation rate in *both* months.
- Compare only matched `node_external_id` values for task-level month-over-month analyses; differences in publication availability and source populations limit interpretation.

## 4. Research Relevance

**Primary — Supporting question 3.** Compare usage share and automation/augmentation *within observed Claude interactions* for individual O*NET tasks. SOC occupation metrics allow a separate **occupation-level** comparison.

**Secondary — Supporting question 5.** Place observed usage alongside public expectations and employment evidence, explicitly without treating the figures as a causal employment effect.

**Potential analytical questions:** Which high-share tasks tilt toward automation or augmentation? Which occupational groups have different collaboration patterns? Are differences across the two published months stable among matched tasks?

## 5. Potential Visualizations (course-compatible)

1. **100% stacked bar chart (mandatory):** Top 10 detailed O*NET tasks ranked by `pct`, with automation/augmentation segments, plus the separate share of each task as a label. May 2026 by default; April as toggle. Avoid suggesting bar length measures prevalence.
2. **Heatmap (mandatory):** Selected tasks or SOC occupation groups × six pattern categories (`directive`, `feedback_loop`, `task_iteration`, `learning`, `validation`, `none`), filtered to one month and geography.
3. **Grouped bar chart (mandatory):** April versus May rates for tasks present in both months, with documented sampling/coverage caveats.

**Optional interactivity:** search by task, sort on `pct` or automation rate, switch month, display precise `node_external_id` and metrics on hover. **Professional field filtering requires careful design:** `soc_occupation` and `onet` are different dimensions in this CSV; it does not expose a direct task-to-SOC crosswalk. Use separate SOC view or a documented external mapping rather than inventing a category per task.

## 6. Limitations and Interpretation

- Claude Chat/Cowork usage is not representative of all AI systems or workers.
- Classification of tasks and interaction patterns is model-derived, not independently verified outcome evidence for every observation.
- O*NET matching describes occupational-task labels; it does not prove the user was employed in the corresponding profession.
- `pct` is **usage share** and bucket percentages describe an interaction **within a node**: their denominators differ.
- Geography-specific detail is uneven. The official documentation specifies global full metric coverage and much more restricted metrics at lower geographic levels. Do not assume cross-country task-level automation comparisons are published.
- Suppressed/unpublished records and rounding limit coverage and aggregation; geography aggregates must not be added to their constituent geographies.
- Only April–May 2026 is contained in this file. Two time points cannot establish a long-term trend or an AI-caused employment effect.
- The 1P API dataset is a distinct source and has not been inspected; do not pool these channels without validated definitions and overlap rules.

## 7. Data Preparation and Integration

### Already completed
- [x] Load and profile every row and all ten columns.
- [x] Verify unique composite metric key and missing values.
- [x] Profile months, geographic levels, categories, metrics.
- [x] Verify bucket and pattern sums on global detailed O*NET rows, with tolerance for rounding.
- [x] Identify top 10 tasks and month-matched task coverage.

### Required **only after selecting a visualization**
- [ ] Select `global` + `onet` + `hierarchy_level=0` + one month, or a separately defined SOC view.
- [ ] Pivot metric rows into columns using full node key (`node_external_id` + node_name + period + geography + dimension + level).
- [ ] Preserve missing/unpublished indicators; do not impute zeros.
- [ ] Rank tasks by `pct` within chosen month; retain both collaboration buckets and exact denominator labels.
- [ ] If supporting April/May comparison, restrict to matched task IDs and document how absence is handled.
- [ ] If grouping tasks by professional field, obtain/validate an O*NET-to-SOC crosswalk; do not infer field from task title alone.
- [ ] Create reproducible Python transform and small CSV/JSON in `data/processed/` for D3.js; avoid committing the 210-MiB source file without team agreement.
- [ ] Validate resulting chart percentages, source notes, and tooltips against original file.

## Sources and Verification

1. Anthropic release documentation: "+MD+"
2. Dataset files: https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2026_06_26/data
3. Project uploaded CSV `aei_claude_ai_2026-06-26.csv`; validation script and machine-readable report in this package.

**Verified on 2026-11-25.**
