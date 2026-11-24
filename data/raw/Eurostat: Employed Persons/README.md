## Data Dictionary

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
