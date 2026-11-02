import json
import sys
import unicodedata

# Load input file (default: "bordeaux.geojson"; allow arg override)
input_file = sys.argv[1] if len(sys.argv) > 1 else "bordeaux.geojson"
output_file = "bordeaux-enriched.json"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Enrich features
enriched_features = []

for feature in data["features"]:
    prop = feature["properties"]
    appellation = "".join(
        char for char in unicodedata.normalize("NFD", prop.get("app", "").casefold())
        if not unicodedata.combining(char)
    )
    if "grand cru" in appellation:
        prop["aoc_level"] = "Grand Cru"
    elif appellation in {
        "pauillac", "margaux", "saint-julien", "saint-emilion",
        "pessac-leognan", "graves", "sauternes",
    }:
        prop["aoc_level"] = "Communal"
    elif appellation in {"medoc", "haut-medoc"}:
        prop["aoc_level"] = "Subregional"
    else:
        prop["aoc_level"] = ""

    prop["main_varietal"] = "semillon" if prop.get("app") == "Sauternes" else "mixed"

    # Use the appellation as the map label.
    prop["label"] = prop.get("app", "")

    # Optional: add or compute a sortKey for display order
    if "sortKey" not in prop:
        prop["sortKey"] = prop.get("aoc_level", 0)

    # Insert further enrichment rules here as needed
    enriched_features.append(feature)

# Optionally sort features (as seen in some enrich scripts)
# features.sort(key=lambda f: f["properties"]["sortKey"])

data["features"] = enriched_features

with open(output_file, "w", encoding="utf-8") as f:
    f.write('{"type": "FeatureCollection", "name": "bordeaux", "features": [\n')
    for i, feature in enumerate(enriched_features):
        f.write(json.dumps(feature, ensure_ascii=False))
        if i < len(enriched_features) - 1:
            f.write(",\n")
    f.write("\n]}\n")

print(f"Enriched file written to {output_file}")
