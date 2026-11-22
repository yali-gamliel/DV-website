"""Prepare a focused public-opinion heatmap for the Data Visualization website.

Source: Stanford AI Index 2026, Figure 9.1.6, based on Ipsos (2025).
Original question: Will the increased use of AI make each aspect of life
better, worse, or stay the same in the next 3-5 years?

This file contains ONLY the fraction answering 'Better' for each aspect.
It does NOT measure observed AI benefits, employment loss, or job replacement.

How to run (place this script and fig_9.1.6.csv in the same folder):
    pip install pandas matplotlib
    python prepare_public_opinion.py
    python prepare_public_opinion.py --show

Outputs (created automatically):
    data/processed/public_opinion_work.json       (96 rows, D3-ready)
    data/processed/public_opinion_work.csv        (same 96 rows)
    data/processed/public_opinion_job_gap.csv     (one row per country/global)
    figures/public_opinion_work_heatmap.png       (Python preview only)

The interactive website visualization will use the JSON file through D3.js.
The Global row is a *published source aggregate*, not another country.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

PROJECT_DIR = Path(__file__).resolve().parent
SOURCE = PROJECT_DIR / "fig_9.1.6.csv"
OUTPUT_DIR = PROJECT_DIR / "data" / "processed"
FIGURES_DIR = PROJECT_DIR / "figures"

# Use only questions relevant to the project's work and employment theme.
# Do not include 'time it takes me to get things done': it does not
# specifically measure workplace productivity.
ASPECTS = {
    "My job": "My job",
    "The job market": "Job market",
    "The economy in my country": "Country's economy",
}
DISPLAY_ORDER = list(ASPECTS.values())
EXPECTED_ROWS = 224
EXPECTED_ASPECTS = 7
EXPECTED_GEOGRAPHIES = 32  # 31 countries + the published Global aggregate.


def load_and_validate() -> pd.DataFrame:
    """Read the original CSV and check its content, not merely its filename."""
    if not SOURCE.exists():
        raise FileNotFoundError(
            f"Could not find {SOURCE.name}. Put it next to prepare_public_opinion.py."
        )

    raw = pd.read_csv(SOURCE, encoding="utf-8-sig")
    # The source CSV has duplicate column headers ('Response' twice).
    # pandas automatically disambiguates the numerical column as 'Response.1'.
    required = {"Response", "Country", "Response.1"}
    if set(raw.columns) != required:
        raise ValueError(
            f"Unexpected CSV columns: {list(raw.columns)}. Expected {sorted(required)}."
        )

    raw = raw.rename(
        columns={"Response": "source_aspect", "Country": "country", "Response.1": "share"}
    )
    raw["source_aspect"] = raw["source_aspect"].astype("string").str.strip()
    raw["country"] = raw["country"].astype("string").str.strip()
    raw["share"] = pd.to_numeric(raw["share"], errors="raise")

    if raw.isna().any().any():
        raise ValueError("Found missing values; inspect the source before proceeding.")
    if not raw["share"].between(0, 1).all():
        raise ValueError("The source should store percentages as fractions in [0, 1].")
    if raw.duplicated(["country", "source_aspect"]).any():
        raise ValueError("Found duplicate country-aspect pairs.")
    if len(raw) != EXPECTED_ROWS:
        raise ValueError(f"Expected {EXPECTED_ROWS} rows; found {len(raw)}.")
    if raw["country"].nunique() != EXPECTED_GEOGRAPHIES:
        raise ValueError("Unexpected number of countries/source aggregates.")
    if raw["source_aspect"].nunique() != EXPECTED_ASPECTS:
        raise ValueError("Unexpected number of survey aspects.")
    if not (raw.groupby("country")["source_aspect"].nunique() == EXPECTED_ASPECTS).all():
        raise ValueError("One or more countries lack an aspect.")
    if "Global" not in set(raw["country"]):
        raise ValueError("Expected a separately labeled Global source aggregate.")
    if not set(ASPECTS).issubset(set(raw["source_aspect"])):
        raise ValueError("At least one selected work-related aspect is missing.")

    return raw


def prepare(raw: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Produce long-form chart data and one-row-per-country comparisons."""
    selected = raw.loc[raw["source_aspect"].isin(ASPECTS)].copy()
    selected["aspect"] = selected["source_aspect"].map(ASPECTS)
    selected["share_pct"] = (100 * selected["share"]).round(1)
    selected["is_source_global"] = selected["country"].eq("Global")

    # Country order is tied to a concrete research question: the difference
    # between perceived benefits for one's OWN job and the broader job market.
    wide = selected.pivot(index="country", columns="aspect", values="share_pct")
    wide = wide.reindex(columns=DISPLAY_ORDER)
    wide["personal_vs_market_gap_pp"] = (wide["My job"] - wide["Job market"]).round(1)
    wide["is_source_global"] = wide.index == "Global"
    wide = wide.reset_index()

    # Keep Global as an anchored reference row, not a 32nd country in rankings.
    reference = wide.loc[wide["is_source_global"]]
    countries = wide.loc[~wide["is_source_global"]].sort_values(
        ["personal_vs_market_gap_pp", "country"], ascending=[False, True]
    )
    wide = pd.concat([reference, countries], ignore_index=True)

    order = {country: i for i, country in enumerate(wide["country"])}
    selected["country_sort_order"] = selected["country"].map(order)
    selected["aspect_sort_order"] = selected["aspect"].map(
        {name: i for i, name in enumerate(DISPLAY_ORDER)}
    )
    selected = selected.sort_values(["country_sort_order", "aspect_sort_order"])

    chart_data = selected[
        ["country", "aspect", "share_pct", "is_source_global", "country_sort_order"]
    ].reset_index(drop=True)
    return chart_data, wide


def save_data(chart_data: pd.DataFrame, comparisons: pd.DataFrame) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    chart_data.to_csv(OUTPUT_DIR / "public_opinion_work.csv", index=False)
    comparisons.to_csv(OUTPUT_DIR / "public_opinion_job_gap.csv", index=False)

    records = chart_data.to_dict(orient="records")
    with (OUTPUT_DIR / "public_opinion_work.json").open("w", encoding="utf-8") as file:
        json.dump(records, file, ensure_ascii=False, indent=2)


def plot_preview(comparisons: pd.DataFrame, show: bool) -> Path:
    """Save a static Python PREVIEW; the website chart will be made with D3."""
    values = comparisons[DISPLAY_ORDER].to_numpy()
    fig, ax = plt.subplots(figsize=(8.3, 13.7))
    img = ax.imshow(values, cmap="Blues", vmin=0, vmax=100, aspect="auto")

    ax.set_xticks(range(len(DISPLAY_ORDER)), DISPLAY_ORDER)
    ax.set_yticks(range(len(comparisons)), comparisons["country"].tolist())
    ax.xaxis.tick_top()
    ax.tick_params(axis="x", length=0, pad=10)
    ax.tick_params(axis="y", length=0)

    for row in range(len(comparisons)):
        for col in range(len(DISPLAY_ORDER)):
            pct = values[row, col]
            ax.text(col, row, f"{pct:.0f}%", ha="center", va="center",
                    fontsize=8, color="white" if pct >= 55 else "black")

    ax.axhline(0.5, color="gray", linewidth=1.4)
    ax.set_title("Where do people expect AI to improve work and the economy?\n"
                 "Share answering 'Better', 2025", fontsize=13, pad=42)
    fig.colorbar(img, ax=ax, fraction=0.035, pad=0.025, label="Share expecting improvement (%)")
    fig.text(0.02, 0.012,
             "Source: Stanford AI Index 2026 Figure 9.1.6 (Ipsos, 2025). "
             "Global = source aggregate, not a country.\n"
             "Countries sorted by (My job - Job market) gap. "
             "Perceptions are not observed labor-market outcomes.",
             fontsize=8)
    fig.tight_layout(rect=(0, 0.055, 1, 1))

    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    output = FIGURES_DIR / "public_opinion_work_heatmap.png"
    fig.savefig(output, dpi=150, bbox_inches="tight")
    if show:
        plt.show()
    plt.close(fig)
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--show", action="store_true", help="Also display preview")
    args = parser.parse_args()

    raw = load_and_validate()
    chart_data, comparisons = prepare(raw)
    save_data(chart_data, comparisons)
    preview = plot_preview(comparisons, show=args.show)

    countries = comparisons.loc[~comparisons["is_source_global"]]
    gap = countries["personal_vs_market_gap_pp"]
    print(f"Source: {len(raw)} observations; {raw['country'].nunique()-1} "
          f"countries + Global; {raw['source_aspect'].nunique()} aspects.")
    print(f"Selected {len(chart_data)} observations for three work-related aspects.")
    print(f"My-job optimism > job-market optimism in {(gap > 0).sum()} countries; "
          f"equal in {(gap == 0).sum()}, lower in {(gap < 0).sum()}.")
    print("\nGlobal source aggregate:")
    print(comparisons.loc[comparisons["country"] == "Global",
                          ["My job", "Job market", "Country's economy",
                           "personal_vs_market_gap_pp"]].to_string(index=False))
    print(f"\nD3-ready JSON: {OUTPUT_DIR / 'public_opinion_work.json'}")
    print(f"Comparison CSV: {OUTPUT_DIR / 'public_opinion_job_gap.csv'}")
    print(f"Preview image: {preview}")
    print("Note: the CSV provides only 'Better' responses, not 'Worse' or 'Same'.")


if __name__ == "__main__":
    main()
