
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw" / "anthropic"

AUTO = "collaboration_bucket_automation_pct"
AUG = "collaboration_bucket_augmentation_pct"
METRICS = ["pct", AUTO, AUG]


def load_tasks(filename):
    df = pd.read_csv(
        RAW / filename,
        usecols=[
            "date_start",
            "geo_level",
            "category_name",
            "hierarchy_level",
            "node_external_id",
            "node_name",
            "metric_id",
            "value",
        ],
    )

    df = df.loc[
        (df["date_start"] == "2026-05-01")
        & (df["geo_level"] == "global")
        & (df["category_name"] == "onet")
        & (df["hierarchy_level"] == 0)
        & (df["metric_id"].isin(METRICS))
    ]

    wide = df.pivot(
        index="node_external_id",
        columns="metric_id",
        values="value",
    )

    return wide.dropna(subset=[AUTO, AUG])


chat = load_tasks("aei_claude_ai_2026-06-26.csv")
api = load_tasks("aei_1p_api_2026-06-26.csv")

# Match identical task IDs across both sources
comparison = chat[METRICS].join(
    api[METRICS],
    how="inner",
    lsuffix="_chat",
    rsuffix="_api",
)

comparison["automation_gap_pp"] = (
    comparison[f"{AUTO}_api"]
    - comparison[f"{AUTO}_chat"]
)

print("Comparable tasks:", len(comparison))

print("\nAutomation gap (API minus Chat):")
print(comparison["automation_gap_pp"].describe())

print("\nTasks with higher automation in API:")
print((comparison["automation_gap_pp"] > 0).sum())

print("\nTasks with higher automation in Chat:")
print((comparison["automation_gap_pp"] < 0).sum())

print("\nTop 10 shared tasks by Chat prevalence:")
print(
    comparison.nlargest(10, "pct_chat")[
        [
            "pct_chat",
            "pct_api",
            f"{AUTO}_chat",
            f"{AUTO}_api",
            "automation_gap_pp",
        ]
    ].round(2).to_string()
)
