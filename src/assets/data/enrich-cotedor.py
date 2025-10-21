import json

# Load GeoJSON
with open("cote-d-or.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

# Enrich features
enriched_features = []

pinot_noir_appellations = [
    "gevrey-chambertin", "morey-saint-denis", "chambolle-musigny", "vougeot", 
    "vosne-romanée", "nuits-saint-georges", "aloxe-corton", "fixin", 
    "savigny-lès-beaune", "chorey-lès-beaune", "beaune", "pommard", "volnay", 
    "marsannay", 
    "couchey", "marsannay-la-côte",
    "comblanchien",
    "pernand-vergelesses", 
    "ladoix-serrigny", 
    "côte de beaune-villages",
    "bonnes-mares",
    "chambertin",
    "chappelle-chambertin",
    "auxey-duresses",
    "clos-de-vougeot",
    "clos saint-denis",
    "clos de tart",
    "clos de la roche",
    "clos des lambrays",
    "richebourg",
    "la tâche",
    "la romanée",
    "romanée-conti",
    "romanée-saint-vivant",
    "charmes-chambertin",
    "latricières-chambertin",
    "mazis-chambertin",
    "griotte-chambertin",
    "ladoix",
    "ruchottes-chambertin",
    "mazoyères-chambertin",
    "chapelle-chambertin",
    "maranges",
    "charlemagne",
    "musigny",
    "côte de nuits-villages ou vins fins de la côte de nuits"
]

chardonnay_appellations = [
    "meursault", "puligny-montrachet", "chassagne-montrachet", "saint-aubin", "santenay", "corton-charlemagne", 
    "corton", "montrachet",
    "monthélie",
    "bâtard-montrachet",
    "blagny",
    "chevalier-montrachet",
    "criots-bâtard-montrachet",
    "bienvenues-bâtard-montrachet",
]

mixed_aocs = [
    "saint-romain"
]

# Map AOC to dominant color
def get_varietal(appellation):
    appellation = appellation.lower()
    if appellation in pinot_noir_appellations:
        return "Pinot Noir"
    elif appellation in chardonnay_appellations:
        return "Chardonnay"
    else:
        return "Mixed"
    
# List of Grand Cru keywords in Côte d'Or
grand_crus = (
    "bonnes-mares", "chambertin", "chambertin-clos-de-bèze", "clos de la roche", 
    "clos saint-denis", "clos de tart", "clos des lambrays", "vougeot", 
    "échezeaux", "grands-échezeaux", "richebourg", "romanée-conti", "la-romanée", 
    "la tâche", "romanée-saint-vivant", "mazis-chambertin", "griotte-chambertin", 
    "chapelle-chambertin", "charmes-chambertin", "mazoyères-chambertin", 
    "latricières-chambertin", "ruchottes-chambertin", "corton", "corton-charlemagne", 
    "charlemagne", "bâtard-montrachet", "bienvenues-bâtard-montrachet", 
    "chevalier-montrachet", "montrachet", "criots-bâtard-montrachet"
)

# Open JSON output
with open("cote-d-or-enriched.json", "w", encoding="utf-8") as out_f:
    for feature in data.get("features", []):
        props = feature.setdefault("properties", {})
        denom = props.get("denom", "").strip()
        appellation = props.get("app", "").strip()

        # Default values
        aoc_level = "Village"
        climat_name = ""

        denom_lower = denom.lower()
        if "premier cru" in denom_lower:
            aoc_level = "Premier Cru"
            parts = denom_lower.split("premier cru")
            climat_name = parts[1].strip().title() if len(parts) > 1 else ""
        elif any(keyword in denom_lower for keyword in grand_crus):
            aoc_level = "Grand Cru"
        elif "-villages" in denom_lower:
            aoc_level = "Village"
        else:
            aoc_level = "Village"
            climat_name = ""

        props["aoc_level"] = aoc_level
        props["climat"] = climat_name
        props["appellation"] = appellation
        props["varietal"] = get_varietal(appellation)    
        print(f"App: {appellation}  -> AOC Level: {aoc_level}, Climat: {climat_name}, Varietal: {props['varietal']}")

        enriched_features.append(feature)
# Write FeatureCollection with one feature per line
with open("cote-d-or-enriched.json", "w", encoding="utf-8") as f:
    f.write('{"type": "FeatureCollection", "name": "Cote dOr", "features": [\n')
    for i, feature in enumerate(enriched_features):
        f.write(json.dumps(feature, ensure_ascii=False))
        if i < len(enriched_features) - 1:
            f.write(",\n")  # comma between features
    f.write("\n]}\n")

print("✅ Enriched file saved as cote-d-or-enriched.json")