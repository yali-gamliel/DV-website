
from pathlib import Path
import pandas as pd

# --------------------------------------------------
# 1. File path
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

csv_path = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "anthropic"
    / "aei_1p_api_2026-06-26.csv"
)

# --------------------------------------------------
# 2. Load data
# --------------------------------------------------

metrics = [
    "pct",
    "collaboration_bucket_automation_pct",
    "collaboration_bucket_augmentation_pct",
]

columns = [
    "date_start",
    "geo_level",
    "category_name",
    "hierarchy_level",
    "node_external_id",
    "node_name",
    "metric_id",
    "value",
]

df = pd.read_csv(csv_path, usecols=columns)

# --------------------------------------------------
# 3. Filter: May 2026, global, O*NET
# --------------------------------------------------

tasks = df[
    (df["date_start"] == "2026-05-01")
    & (df["geo_level"] == "global")
    & (df["category_name"] == "onet")
    & (df["metric_id"].isin(metrics))
].copy()

print("=== ANTHROPIC API ===")

print("\nFiltered rows:", len(tasks))

print("\nMetric counts:")
print(tasks["metric_id"].value_counts())

print("\nHierarchy levels:")
print(tasks["hierarchy_level"].value_counts().sort_index())

print("\nUnique task identifiers:")
print(tasks["node_external_id"].nunique())

# --------------------------------------------------
# 4. Individual tasks (hierarchy level 0)
# --------------------------------------------------

individual_tasks = tasks[
    tasks["hierarchy_level"] == 0
].copy()

wide = individual_tasks.pivot(
    index=["node_external_id", "node_name"],
    columns="metric_id",
    values="value"
).reset_index()

print("\nIndividual tasks:", len(wide))

print("\nMissing values:")
print(wide[metrics].isna().sum())

# --------------------------------------------------
# 5. Validate automation + augmentation
# --------------------------------------------------

required = [
    "collaboration_bucket_automation_pct",
    "collaboration_bucket_augmentation_pct",
]

complete = wide.dropna(subset=required).copy()

complete["total"] = (
    complete[required[0]] + complete[required[1]]
)

print("\nTasks with complete collaboration metrics:", len(complete))

print("\nAutomation + Augmentation totals:")
print(complete["total"].describe())

print("\nTasks where total differs from 100 by more than 0.1:")
print(((complete["total"] - 100).abs() > 0.1).sum())

# --------------------------------------------------
# 6. Top 10 tasks by prevalence
# --------------------------------------------------

top10 = complete.nlargest(10, "pct")

print("\nTop 10 tasks by prevalence:")
print(
    top10[
        ["node_name", "pct"] + required
    ].to_string(index=False)
)

print("\nAnalysis completed.")
