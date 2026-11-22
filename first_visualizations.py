"""First visualizations: Planning robustness (Stanford AI Index 2026).

Run this script from your Python project after placing these three files together:
    first_visualizations.py
    fig_2.4.9.csv
    fig_2.4.10.csv

Install once (in your existing Python environment):
    pip install pandas matplotlib

Run:
    python first_visualizations.py
    python first_visualizations.py --model Gemini --show

This script deliberately separates DATA PREPARATION (Python) from the final
interactive website chart (D3.js). The JSON it creates can later be loaded
by D3.js without redoing the data-cleaning steps.

Data sources:
- Stanford AI Index 2026, Figures 2.4.9 (standard) and 2.4.10 (obfuscated)
- Corrêa, Pereira & Seipp (2025), The 2025 Planning Performance of Frontier LLMs
  https://arxiv.org/html/2511.09378v1

Important: The LAMA baseline is a specialized classical planner, NOT an LLM.
The dataset describes a controlled planning benchmark, NOT workplace tasks.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


# Paths are relative to THIS script, so you may run it from any working folder.
PROJECT_DIR = Path(__file__).resolve().parent
STANDARD_CSV = PROJECT_DIR / "fig_2.4.9.csv"
OBFUSCATED_CSV = PROJECT_DIR / "fig_2.4.10.csv"
PROCESSED_DIR = PROJECT_DIR / "data" / "processed"
FIGURES_DIR = PROJECT_DIR / "figures"

# Confirmed in the original research paper: 45 tasks in each of 8 domains.
TASKS_PER_DOMAIN = 45
EXPECTED_DOMAINS = 8
EXPECTED_SYSTEMS = 4

DOMAIN_ORDER = [
    "Blocksworld", "Childsnack", "Floortile", "Miconic",
    "Rovers", "Sokoban", "Spanner", "Transport",
]
MODEL_ORDER = ["LAMA", "R1", "Gemini", "GPT-5"]
CONDITIONS = ("Standard", "Obfuscated")


def read_and_validate(path: Path, condition: str) -> pd.DataFrame:
    """Read one figure, validate its structure, and label its condition."""
    if not path.is_file():
        raise FileNotFoundError(
            f"Missing {path.name}. Put it next to first_visualizations.py."
        )

    df = pd.read_csv(path)
    expected_columns = {"domain", "model_planner", "solved_tasks"}
    if set(df.columns) != expected_columns:
        raise ValueError(
            f"Unexpected columns in {path.name}: {df.columns.tolist()}; "
            f"expected {sorted(expected_columns)}."
        )

    if df.isna().any().any():
        raise ValueError(f"Missing values found in {path.name}.")
    if df.duplicated(["domain", "model_planner"]).any():
        raise ValueError(f"Duplicate domain–system pairs found in {path.name}.")

    if set(df["domain"]) != set(DOMAIN_ORDER):
        raise ValueError(f"Unexpected or missing planning domains in {path.name}.")
    if set(df["model_planner"]) != set(MODEL_ORDER):
        raise ValueError(f"Unexpected or missing model/system labels in {path.name}.")
    if len(df) != EXPECTED_DOMAINS * EXPECTED_SYSTEMS:
        raise ValueError(f"Expected 32 observations in {path.name}; got {len(df)}.")

    values = pd.to_numeric(df["solved_tasks"], errors="raise")
    if not ((values >= 0) & (values <= TASKS_PER_DOMAIN) & (values % 1 == 0)).all():
        raise ValueError(f"Invalid solved-task counts in {path.name}.")

    df = df.copy()
    df["solved_tasks"] = values.astype(int)
    df["condition"] = condition
    df["total_tasks"] = TASKS_PER_DOMAIN
    df["success_rate_pct"] = (100 * df["solved_tasks"] / df["total_tasks"]).round(2)
    return df


def prepare_data() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Create one tidy dataset, one matched comparison, and one summary."""
    standard = read_and_validate(STANDARD_CSV, "Standard")
    obfuscated = read_and_validate(OBFUSCATED_CSV, "Obfuscated")

    # Both CSVs must contain exactly the same domain–system pairs.
    keys = ["domain", "model_planner"]
    left_keys = set(map(tuple, standard[keys].itertuples(index=False, name=None)))
    right_keys = set(map(tuple, obfuscated[keys].itertuples(index=False, name=None)))
    if left_keys != right_keys:
        raise ValueError("Standard and obfuscated files do not have matching pairs.")

    # Long/tidy structure: one row per domain × system × condition (64 rows).
    tidy = pd.concat([standard, obfuscated], ignore_index=True)
    tidy["domain"] = pd.Categorical(tidy["domain"], DOMAIN_ORDER, ordered=True)
    tidy["model_planner"] = pd.Categorical(
        tidy["model_planner"], MODEL_ORDER, ordered=True
    )
    tidy["condition"] = pd.Categorical(
        tidy["condition"], CONDITIONS, ordered=True
    )
    tidy = tidy.sort_values(["model_planner", "domain", "condition"])
    tidy = tidy.reset_index(drop=True)

    # Matched/wide structure: one row per domain × system (32 rows).
    paired = tidy.pivot(
        index=["domain", "model_planner"],
        columns="condition",
        values="solved_tasks",
    ).reset_index()
    paired.columns.name = None
    paired = paired.rename(columns={
        "Standard": "standard_solved",
        "Obfuscated": "obfuscated_solved",
    })
    paired["total_tasks"] = TASKS_PER_DOMAIN
    paired["standard_rate_pct"] = (100 * paired["standard_solved"] / TASKS_PER_DOMAIN).round(2)
    paired["obfuscated_rate_pct"] = (100 * paired["obfuscated_solved"] / TASKS_PER_DOMAIN).round(2)
    paired["change_tasks"] = paired["obfuscated_solved"] - paired["standard_solved"]
    # Negative change = lower performance under obfuscation; positive = higher.
    paired["change_percentage_points"] = (
        paired["obfuscated_rate_pct"] - paired["standard_rate_pct"]
    ).round(2)
    paired = paired.sort_values(["model_planner", "domain"]).reset_index(drop=True)

    # A descriptive overview (NOT a statistical test or a new benchmark score).
    summary = (
        tidy.groupby(["model_planner", "condition"], observed=True)
        .agg(solved_tasks=("solved_tasks", "sum"), total_tasks=("total_tasks", "sum"))
        .reset_index()
    )
    summary["success_rate_pct"] = (
        100 * summary["solved_tasks"] / summary["total_tasks"]
    ).round(2)
    return tidy, paired, summary


def export_data(tidy: pd.DataFrame, paired: pd.DataFrame, summary: pd.DataFrame) -> None:
    """Save reusable data for Python analysis and the future D3.js website."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    # Convert pandas categorical columns to plain strings before JSON export.
    for frame, name in [
        (tidy, "planning_robustness"),
        (paired, "planning_paired"),
        (summary, "planning_summary"),
    ]:
        frame.to_csv(PROCESSED_DIR / f"{name}.csv", index=False)

    web_records = tidy.assign(
        domain=tidy["domain"].astype(str),
        model_planner=tidy["model_planner"].astype(str),
        condition=tidy["condition"].astype(str),
    ).to_dict(orient="records")

    # Plain JSON array is convenient for d3.json('data/processed/planning_robustness.json').
    with (PROCESSED_DIR / "planning_robustness.json").open(
        "w", encoding="utf-8"
    ) as f:
        json.dump(web_records, f, ensure_ascii=False, indent=2)

    print(f"\nPrepared files in: {PROCESSED_DIR}")
    print("  - planning_robustness.csv  (64 rows: tidy source for D3)")
    print("  - planning_robustness.json (same 64 rows, web-ready)")
    print("  - planning_paired.csv      (32 matched comparisons)")
    print("  - planning_summary.csv     (system totals by condition)")


def plot_grouped_bars(paired: pd.DataFrame, model: str, show: bool) -> Path:
    """Create an INITIAL grouped bar chart for one selected system."""
    subset = paired.loc[paired["model_planner"] == model].copy()
    subset = subset.set_index("domain").reindex(DOMAIN_ORDER).reset_index()
    if subset[["standard_solved", "obfuscated_solved"]].isna().any().any():
        raise ValueError(f"Missing domain results for {model}.")

    x = np.arange(len(DOMAIN_ORDER))
    width = 0.36
    fig, ax = plt.subplots(figsize=(12, 5.8))
    ax.bar(x - width / 2, subset["standard_solved"], width, label="Standard")
    ax.bar(x + width / 2, subset["obfuscated_solved"], width, label="Obfuscated")

    ax.set_title(f"Planning robustness — {model}")
    ax.set_ylabel("Tasks solved (out of 45 per domain)")
    ax.set_xlabel("Planning domain")
    ax.set_xticks(x, DOMAIN_ORDER, rotation=25, ha="right")
    ax.set_ylim(0, TASKS_PER_DOMAIN + 5)
    ax.legend(title="Task description")
    ax.grid(axis="y", alpha=0.18)
    ax.set_axisbelow(True)
    fig.text(
        0.01, 0.015,
        "Source: Stanford AI Index 2026, Figures 2.4.9–2.4.10; "
        "Corrêa et al. (2025). LAMA is a classical planner.",
        fontsize=8,
    )
    fig.tight_layout(rect=(0, 0.045, 1, 1))

    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    safe_model = model.replace(" ", "_").replace("/", "_")
    file_path = FIGURES_DIR / f"planning_grouped_bar_{safe_model}.png"
    fig.savefig(file_path, dpi=170, bbox_inches="tight")
    if show:
        plt.show()
    plt.close(fig)
    return file_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--model", default="GPT-5", choices=MODEL_ORDER,
        help="Which model/system to display in the initial plot (default: GPT-5)",
    )
    parser.add_argument(
        "--show", action="store_true", help="Also open the Matplotlib preview window"
    )
    args = parser.parse_args()

    tidy, paired, summary = prepare_data()
    export_data(tidy, paired, summary)
    preview_path = plot_grouped_bars(paired, args.model, args.show)

    print("\nTotals across all 8 domains (360 tasks per system and condition):")
    print(summary.to_string(index=False))
    print(f"\nPreview chart saved to: {preview_path}")
    print("\nNext website step: load planning_robustness.json with D3.js.")
    print("Do not upload the PNG in place of the final interactive SVG chart.")


if __name__ == "__main__":
    main()
