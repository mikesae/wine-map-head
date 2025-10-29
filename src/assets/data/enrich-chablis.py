import json

# Load your Chablis GeoJSON
with open("chablis.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Enrich features
enriched_features = []

for feature in data.get("features", []):
    props = feature.setdefault("properties", {})
    denom = props.get("denom", "").strip()

    aoc_level = "Village"
    climat_name = ""
    appellation = ""
    label = ""

    denom_lower = denom.lower()
    if "grand cru" in denom_lower:
        aoc_level = "Grand Cru"
        parts = denom_lower.split("grand cru")
        appellation = parts[0].strip().title() or "Chablis"
        climat_name = parts[1].strip().title() if len(parts) > 1 else ""
        label = climat_name
    elif "premier cru" in denom_lower:
        aoc_level = "Premier Cru"
        parts = denom_lower.split("premier cru")
        appellation = parts[0].strip().title() or "Chablis"
        climat_name = parts[1].strip().title() if len(parts) > 1 else ""
        label = climat_name
    else:
        aoc_level = "Village"
        tokens = denom.strip().split(" ", 1)
        appellation = tokens[0].title() if tokens else "Chablis"
        climat_name = tokens[1].title() if len(tokens) > 1 else ""

    props["aoc_level"] = aoc_level
    props["climat"] = climat_name
    props["appellation"] = appellation
    props["varietal"] = "Chardonnay"
    props["label"] = label.title()

    # do not append if aoc_level premier cru and climat is empty or if aoc_level grand cru and climat is empty  
    if (aoc_level == "Premier Cru" or aoc_level == "Grand Cru") and climat_name == "":
        continue

    enriched_features.append(feature)

# Write FeatureCollection with one feature per line
with open("chablis-enriched.json", "w", encoding="utf-8") as f:
    f.write('{"type": "FeatureCollection", "name": "chablis", "features": [\n')
    for i, feature in enumerate(enriched_features):
        f.write(json.dumps(feature, ensure_ascii=False))
        if i < len(enriched_features) - 1:
            f.write(",\n")  # comma between features
    f.write("\n]}\n")

print("✅ Enriched file saved as chablis-enriched.json")