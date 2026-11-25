# Anthropic Economic Index — Raw Data Sources (June 2026)

**Project:** *Is AI Really Replacing Us? Exploring the Gap Between Public Perception, AI Capabilities, and Real-World Impact*

**Research question 3:** *Which occupational tasks are automated or augmented through observed AI use?*

## Purpose of this folder

This folder documents the original Anthropic Economic Index datasets used for the project. The large original CSV files are **not committed to this repository**; download them from the official source when needed. Keep the downloaded originals unchanged.

## Official source

- Dataset repository: https://huggingface.co/datasets/Anthropic/EconomicIndex
- June 2026 release: https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2026_06_26
- Official data documentation: https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data_documentation.md

## Source files

| Filename | Source | Approximate size | Notes |
|---|---|---:|---|
| [`aei_claude_ai_2026-06-26.csv`](https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data/aei_claude_ai_2026-06-26.csv) | Claude Chat / Cowork | 219 MB | Includes global and geographic aggregates. |
| [`aei_1p_api_2026-06-26.csv`](https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/release_2026_06_26/data/aei_1p_api_2026-06-26.csv) | Anthropic first-party API | 77.3 MB | Global aggregates; excludes Claude Code per release documentation. |

Both files cover April–May 2026. They describe **different usage populations**. Do not combine their percentages into one overall rate without a valid shared denominator and documented methodology.

## How to work with these data

1. Download the necessary CSV file(s) from the official source links above.
2. Store the originals locally and do not edit them.
3. Use a reproducible Python/pandas script or notebook for filtering, reshaping, validation, and comparisons.
4. Export small chart-ready CSV/JSON files into `data/processed/` when the visualization requirements are finalized.
5. Record the source release, filters, aggregation definitions, and limitations alongside the processed output.

## Project documentation

See the following files in the repository's `metadata/` directory:

- [`anthropic_claude_ai_2026_06_metadata.md`](../../../metadata/anthropic_claude_ai_2026_06_metadata.md)
- [`anthropic_1p_api_2026_06_metadata.md`](../../../metadata/anthropic_1p_api_2026_06_metadata.md)
- [`anthropic_master_catalog_2026_en.md`](../../../metadata/anthropic_master_catalog_2026_en.md)
- [`anthropic_README.md`](../../../metadata/anthropic_README.md)

## Status

- [x] Raw sources identified and documented
- [x] Source-level EDA and metadata prepared
- [ ] Visualization-specific data transformation and validation
- [ ] Processed CSV/JSON files for D3.js
- [ ] Visualization implementation

**Interpretation caution:** The observed patterns are platform-specific AI usage, not direct evidence of job replacement or causal effects on employment.
