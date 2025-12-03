import json

# Load GeoJSON
with open("chalonnaise.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

# Enrich features
enriched_features = []

# Map AOC to dominant color
def get_varietal(aoc_name):
    aoc = aoc_name.lower()
    if "mercurey" in aoc or "givry" in aoc:
        return "Pinot Noir"
    elif "rully" in aoc or "montagny" in aoc or "pouilly-fuissé" in aoc:
        return "Chardonnay"
    elif "bouzeron" in aoc:
        return "Aligoté"
    else:
        return "Mixed"

# Open JSON output
with open("chalonnaise-enriched.json", "w", encoding="utf-8") as out_f:
    for feature in data.get("features", []):
        props = feature.setdefault("properties", {})
        denom = props.get("denom", "").strip()

        # Default values
        aoc_level = "Village"
        climat_name = ""
        appellation = ""
        label = ""

        denom_lower = denom.lower()
        if "premier cru" in denom_lower:
            aoc_level = "Premier Cru"
            parts = denom_lower.split("premier cru")
            appellation = parts[0].strip().title()
            climat_name = parts[1].strip().title() if len(parts) > 1 else ""
            label = climat_name
        elif "grand cru" in denom_lower:
            aoc_level = "Grand Cru"
            parts = denom_lower.split("grand cru")
            appellation = parts[0].strip().title()
            climat_name = parts[1].strip().title() if len(parts) > 1 else ""
            label = denom
        else:
            # No premier/grand cru: assume first word is AOC
            tokens = denom.strip().split(" ", 1)
            appellation = tokens[0].title()
            climat_name = tokens[1].title() if len(tokens) > 1 else ""

        props["aoc_level"] = aoc_level
        props["climat"] = climat_name
        props["appellation"] = appellation
        props["varietal"] = get_varietal(appellation)
        props["label"] = label.title()
        
        # do not append if aoc_level premier cru and climat is empty
        if aoc_level == "Premier Cru" and climat_name == "":
            continue

        enriched_features.append(feature)
# Write FeatureCollection with one feature per line
with open("chalonnaise-enriched.json", "w", encoding="utf-8") as f:
    f.write('{"type": "FeatureCollection", "name": "chalonnaise", "features": [\n')
    for i, feature in enumerate(enriched_features):
        f.write(json.dumps(feature, ensure_ascii=False))
        if i < len(enriched_features) - 1:
            f.write(",\n")  # comma between features
    f.write("\n]}\n")

print("✅ Enriched file saved as chalonnaise-enriched.json")