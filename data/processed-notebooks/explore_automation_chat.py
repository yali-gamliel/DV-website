
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
    / "aei_claude_ai_2026-06-26.csv"
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

print("=== CLAUDE CHAT / COWORK ===")

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
# 6. Top 20 tasks by prevalence
# --------------------------------------------------

top20 = complete.nlargest(20, "pct")

print("\nTop 20 tasks by prevalence:")
print(
    top20[
        [
            "node_external_id",
            "node_name",
            "pct",
            "collaboration_bucket_automation_pct",
            "collaboration_bucket_augmentation_pct",
        ]
    ].to_string(index=False)
)

# --------------------------------------------------
# 7. Prevalence concentration analysis
# --------------------------------------------------

# Tasks with complete Automation/Augmentation metrics
ranked = complete.sort_values("pct", ascending=False)

top10 = ranked.head(10)
top20 = ranked.head(20)

print("\n=== PREVALENCE ANALYSIS ===")

print("\nSum of prevalence values:")
print(f"Top 10: {top10['pct'].sum():.2f}%")
print(f"Top 20: {top20['pct'].sum():.2f}%")
print(f"All complete tasks: {ranked['pct'].sum():.2f}%")

print("\nPrevalence range in Top 20:")
print(f"Highest: {top20['pct'].max():.2f}%")
print(f"Lowest: {top20['pct'].min():.2f}%")

print("\nTop 20 share of summed task prevalence:")
total = ranked["pct"].sum()

if total > 0:
    concentration = top20["pct"].sum() / total * 100
    print(f"{concentration:.2f}%")
else:
    print("Cannot calculate: total is zero")

print("\nNumber of selected tasks:")
print(f"{len(top20)} out of {len(ranked)} complete tasks")

print("\nNote:")
print("Summed task prevalence is not unique conversation coverage.")


# --------------------------------------------------
# 8. GWA family-level analysis
# --------------------------------------------------

family_data = tasks[
    tasks["hierarchy_level"] == 3
].copy()

families = family_data.pivot(
    index=["node_external_id", "node_name"],
    columns="metric_id",
    values="value"
).reset_index()

print("\n=== GWA ACTIVITY FAMILIES ===")

print("Total families:", len(families))

print("\nMissing metrics:")
print(families[metrics].isna().sum())

families_complete = families.dropna(
    subset=[
        "collaboration_bucket_automation_pct",
        "collaboration_bucket_augmentation_pct",
    ]
).copy()

families_complete = families_complete.sort_values(
    "pct", ascending=False
)

print("\nFamilies with complete metrics:")
print(
    families_complete[
        [
            "node_external_id",
            "node_name",
            "pct",
            "collaboration_bucket_automation_pct",
            "collaboration_bucket_augmentation_pct",
        ]
    ].to_string(index=False)
)


# --------------------------------------------------
# 9. Inspect O*NET hierarchy identifiers
# --------------------------------------------------

print("\n=== O*NET HIERARCHY CHECK ===")

for level, name in [
    (3, "GWA - Families"),
    (2, "IWA - Intermediate"),
    (1, "DWA - Detailed"),
    (0, "Individual Tasks"),
]:
    subset = tasks[
        (tasks["hierarchy_level"] == level)
        & (tasks["metric_id"] == "pct")
    ]

    print(f"\n{name}")
    print("Number of nodes:", len(subset))

    print(
        subset[
            ["node_external_id", "node_name"]
        ].head(5).to_string(index=False)
    )
