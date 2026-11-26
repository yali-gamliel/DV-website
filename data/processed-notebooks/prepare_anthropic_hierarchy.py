
from pathlib import Path
import pandas as pd

# ----------------------------------------
# 1. File paths and configuration
# ----------------------------------------

ROOT = Path(__file__).resolve().parents[2]

SOURCE = (
    ROOT / "data" / "raw" / "anthropic"
    / "aei_claude_ai_2026-06-26.csv"
)

METRICS = [
    "pct",
    "collaboration_bucket_automation_pct",
    "collaboration_bucket_augmentation_pct",
]

LEVELS = {
    3: "GWA",
    2: "IWA",
    1: "DWA",
}

# ----------------------------------------
# 2. Load and filter the data
# ----------------------------------------

df = pd.read_csv(
    SOURCE,
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
    dtype={"node_external_id": "string"},
)

filtered = df.loc[
    (df["date_start"] == "2026-05-01")
    & (df["geo_level"] == "global")
    & (df["category_name"] == "onet")
    & (df["hierarchy_level"].isin(LEVELS))
    & (df["metric_id"].isin(METRICS))
].copy()

# ----------------------------------------
# 3. Convert metrics into columns
# ----------------------------------------

nodes = filtered.pivot(
    index=[
        "hierarchy_level",
        "node_external_id",
        "node_name",
    ],
    columns="metric_id",
    values="value",
).reset_index()

nodes = nodes.rename(columns={
    "node_external_id": "id",
    "node_name": "name",
    "collaboration_bucket_automation_pct": "automation",
    "collaboration_bucket_augmentation_pct": "augmentation",
})

nodes["level"] = nodes["hierarchy_level"].map(LEVELS)

# ----------------------------------------
# 4. Identify the parent of each node
# ----------------------------------------

def get_parent(row):
    node_id = row["id"]
    level = row["level"]

    if level == "GWA":
        return None

    if level == "IWA":
        return node_id.rsplit(".I", 1)[0]

    if level == "DWA":
        return node_id.rsplit(".D", 1)[0]

    return None


nodes["parent_id"] = nodes.apply(
    get_parent, axis=1
)

# ----------------------------------------
# 5. Validate hierarchy
# ----------------------------------------

print("=== HIERARCHY VALIDATION ===")

print("\nNodes by level:")
print(nodes["level"].value_counts())

print("\nMissing metrics:")
print(
    nodes[
        ["pct", "automation", "augmentation"]
    ].isna().sum()
)

ids = set(nodes["id"])

children = nodes[nodes["parent_id"].notna()].copy()

missing_parents = children[
    ~children["parent_id"].isin(ids)
]

print("\nNodes with missing parents:")
print(len(missing_parents))

if not missing_parents.empty:
    print(
        missing_parents[
            ["level", "id", "name", "parent_id"]
        ].to_string(index=False)
    )

# ----------------------------------------
# 6. Validate percentages
# ----------------------------------------

complete = nodes.dropna(
    subset=["automation", "augmentation"]
).copy()

complete["total"] = (
    complete["automation"]
    + complete["augmentation"]
)

invalid_totals = complete[
    (complete["total"] - 100).abs() > 0.1
]

print("\nNodes with invalid percentage totals:")
print(len(invalid_totals))

# ----------------------------------------
# 7. Inspect one family
# ----------------------------------------

family_id = "4.A.3.b.1"  # Working with Computers

print("\n=== WORKING WITH COMPUTERS ===")

family = nodes[nodes["id"] == family_id]
children_of_family = nodes[
    nodes["parent_id"] == family_id
]

print("\nFamily:")
print(
    family[
        ["name", "pct", "automation", "augmentation"]
    ].to_string(index=False)
)

print("\nDirect children:")
print(
    children_of_family[
        ["id", "name", "pct", "automation", "augmentation"]
    ].sort_values(
        "pct", ascending=False
    ).to_string(index=False)
)

print("\nValidation completed.")


# ----------------------------------------
# 8. Inspect nodes with missing metrics
# ----------------------------------------

missing = nodes[
    nodes[["automation", "augmentation"]].isna().any(axis=1)
]

print("\n=== NODES WITH MISSING METRICS ===")

print(
    missing[
        [
            "level",
            "id",
            "name",
            "pct",
            "automation",
            "augmentation",
            "parent_id",
        ]
    ].to_string(index=False)
)

import json

# ----------------------------------------
# 9. Export hierarchical JSON
# ----------------------------------------

OUTPUT = (
    ROOT / "data" / "processed"
    / "anthropic_activity_hierarchy.json"
)

def clean_number(value):
    if pd.isna(value):
        return None
    return float(value)


def build_node(row, children=None):
    return {
        "id": str(row["id"]),
        "name": str(row["name"]),
        "level": str(row["level"]),
        "prevalence": clean_number(row["pct"]),
        "automation": clean_number(row["automation"]),
        "augmentation": clean_number(row["augmentation"]),
        "children": children or [],
    }


def get_children(parent_id):
    subset = nodes[
        nodes["parent_id"] == parent_id
    ].sort_values(
        "pct", ascending=False
    )

    return subset


hierarchy = []

families_sorted = nodes[
    nodes["level"] == "GWA"
].sort_values(
    "pct", ascending=False
)

for _, gwa in families_sorted.iterrows():

    iwa_nodes = []

    for _, iwa in get_children(gwa["id"]).iterrows():

        dwa_nodes = [
            build_node(dwa)
            for _, dwa in get_children(iwa["id"]).iterrows()
        ]

        iwa_nodes.append(
            build_node(iwa, dwa_nodes)
        )

    hierarchy.append(
        build_node(gwa, iwa_nodes)
    )


OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True,
)

with open(OUTPUT, "w", encoding="utf-8") as file:
    json.dump(
        hierarchy,
        file,
        ensure_ascii=False,
        indent=2,
        allow_nan=False,
    )

print("\n=== JSON EXPORT ===")
print("File:", OUTPUT)
print("Families exported:", len(hierarchy))
print("Total nodes exported:", sum(
    1 + len(gwa["children"])
    + sum(len(iwa["children"]) for iwa in gwa["children"])
    for gwa in hierarchy
))
