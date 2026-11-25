
from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]

csv_path = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "anthropic"
    / "aei_claude_ai_2026-06-26.csv"
)

columns = [
    "date_start",
    "geo_level",
    "category_name",
    "metric_id",
]

df = pd.read_csv(csv_path, usecols=columns)

print("Total rows:", len(df))

print("\nDates:")
print(df["date_start"].value_counts().sort_index())

print("\nGeographic levels:")
print(df["geo_level"].value_counts())

print("\nCategories:")
print(df["category_name"].value_counts())

print("\nAvailable metrics:")
for metric in sorted(df["metric_id"].dropna().unique()):
    print(metric)
