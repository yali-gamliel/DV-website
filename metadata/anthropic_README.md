# Anthropic Economic Index — 2026 Data Documentation

**Project:** *Is AI Really Replacing Us? Exploring the Gap Between Public Perception, AI Capabilities, and Real-World Impact*

**Research question 3:** *Which occupational tasks are automated or augmented through observed AI use?*

## Dataset sources

This project uses the Anthropic Economic Index **June 26, 2026 (V6)** release. Its two datasets cover **April–May 2026**:

| Source | Original file | Coverage | Metadata |
|---|---|---|---|
| Claude Chat/Cowork | `aei_claude_ai_2026-06-26.csv` | Global, country, and subregion | [Claude AI metadata](anthropic_claude_ai_2026_06_metadata.md) |
| First-party Anthropic API (excluding Claude Code) | `aei_1p_api_2026-06-26.csv` | Global | [API metadata](anthropic_1p_api_2026_06_metadata.md) |

**[Master data catalog](anthropic_master_catalog_2026_en.md)** — a combined overview of data structures, key measures, quality checks, research questions, potential visualizations, and limitations.

**Official dataset:** https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2026_06_26  
**Official field documentation:** https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data_documentation.md

## What the datasets measure

The files contain **aggregated observations of Claude usage**, including occupational-task prevalence and classifications of automation versus augmentation. They do **not** directly measure job losses, worker displacement, or causal effects on employment. The two source populations differ and should not be pooled as one representative sample.

## Data handling and project status

- [x] Inspect both uploaded source CSVs and document their schemas and quality checks.
- [x] Add separate metadata files and a shared master catalog.
- [ ] Select and specify the final visualization(s).
- [ ] Create a reproducible Python/pandas preparation script if needed.
- [ ] Export small visualization-ready CSV/JSON files to `data/processed/`.
- [ ] Implement and validate the visualization(s) with D3.js.

**Raw data policy:** Keep the official CSVs unchanged. The large original datasets are **not included in this documentation PR**; obtain them from the official release. Missing published task–metric combinations must not be treated as zeros. Any derived files should be documented and stored separately.

**Previous version:** March 2025 (V2) was investigated and archived separately; it is not combined with the 2026 datasets.
