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
    "côte de nuits-villages ou vins fins de la côte de nuits",
    "echezeaux", 
    "grands-echezeaux"
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

mixed_appellations = [
    "saint-romain",
    "saint-aubin"
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
"bâtard-montrachet"
"bienvenues-bâtard-montrachet"
"bonnes-mares"
"charlemagne"
"chambertin"
"chambertin-clos-de-bèze"
"charmes-chambertin"
"chapelle-chambertin"
"chevalier-montrachet"
"clos de la roche"
"clos de tart"
"clos des lambrays"
"clos saint-denis"
"corton"
"corton-charlemagne"
"criots-bâtard-montrachet"
"echezeaux"
"griotte-chambertin"
"grands-echezeaux"
"la tâche"
"la romanée"
"latricières-chambertin"
"mazis-chambertin"
"mazoyères-chambertin"
"montrachet"
"musigny"
"richebourg"
"romanée-conti"
"romanée-saint-vivant"
"ruchottes-chambertin"
"vougeot"
)


def is_corton_appellation(appellation):
    appellation = appellation.lower()
    return appellation in ["aloxe-corton", "corton", "charlemagne", "corton-charlemagne"]

def is_mixed_appellation(appellation):
    appellation = appellation.lower()
    return appellation in mixed_appellations

def is_saint_aubin_appellation(appellation):
    appellation = appellation.lower()
    return appellation == "saint-aubin"

# Saint-Aubin Premier Crus by dominant grape (in practice)

# predominantly chardonnay (white)
saint_aubin_whites = [
    "en remilly",
    "les murgers des dents de chien",
    "sur gamay",
    "la chatenière",
    "en créot",
    "le champlots",
    "les frionnes",
    "les combes",
    "derrière chez edouard",
    "les castets",
    "les travers de marinot",
]

# predominantly pinot noir (red)
saint_aubin_reds = [
    "les pitangerets",
    "les perrières",
    "les côtes de bas",
    "sur le sentier du clou",
    "les meix guillaume",
    "en la râche",
    "derrière la tour",
]

def get_saint_aubin_varietal(climat):
    climat = climat.lower()
    if climat in saint_aubin_whites:
        return "Chardonnay"
    elif climat in saint_aubin_reds:
        return "Pinot Noir"
    else:
        return "Mixed"
    
def is_saint_romain_appellation(appellation):
    appellation = appellation.lower()
    return appellation == "saint-romain"

def is_chassagne_montrachet_appellation(appellation):
    appellation = appellation.lower()
    return appellation == "chassagne-montrachet"

def process_saint_aubin(denom):
    denom = denom.lower()
    varietal = "Chardonnay"
    aoc_level = "Village"
    climat_name = ""
    mixed_varietal = False

    if denom == "saint-aubin":
        aoc_level = "Village"
        varietal = "Chardonnay"
        climat_name = ""
        mixed_varietal = True
    elif "premier cru" in denom:
        parts = denom.split("premier cru")
        climat_name = parts[1].strip().title() if len(parts) > 1 else ""
        varietal = get_saint_aubin_varietal(climat_name)
        aoc_level = "Premier Cru"
        mixed_varietal = False
    return aoc_level, varietal, climat_name, mixed_varietal

# Handle Corton and Aloxe-Corton appellations
# Rules are
# if appellation is Aloxe Corton and denom is Aloxe-Corton, 
#     aoc level is Village and varietal is Pinot Noir
# If appellation is Aloxe Corton and denom contains premier cru and a vineyard name, 
#     aoc level is Premier Cru, varietal is Pinot Noir, climat is the vineyard name
# if appellation is Corton and denom is Corton and a vineyard name is given, 
#     aoc level is Grand Cru L2, varietal is Pinot Noir, and climat is the vineyard name
#
# We use a special "Grand Cru L2" level to indicate that these are grand crus and should be drawn and labeled with higher priority.
# We do this so for example Corton Le Corton draws above Corton Charlemagne on the map, since their regions can overlap.

def process_corton(appellation, denom):
    appellation = appellation.lower()
    denom = denom.lower()
    if appellation == "aloxe-corton":
        if denom == "aloxe-corton":
            return "Village", "Pinot Noir", ""
        elif "premier cru" in denom:
            parts = denom.split("premier cru")
            climat_name = parts[1].strip().title() if len(parts) > 1 else ""
            return "Premier Cru", "Pinot Noir", climat_name
    elif appellation == "corton":
        if denom.startswith("corton "):
            # climat name is everything after "corton "
            climat_name = denom[len("corton "):].strip().title()
            aoc = "Grand Cru L2" if climat_name != "Corton" else "Grand Cru"
            return aoc, "Pinot Noir", climat_name
        elif "premier cru" in denom:
            parts = denom.split("premier cru")
            climat_name = parts[1].strip().title() if len(parts) > 1 else ""
            return "Premier Cru", "Pinot Noir", climat_name
    elif appellation in ["charlemagne", "corton-charlemagne"]:
        climat_name = appellation.title()
        return "Grand Cru", "Chardonnay", climat_name
    return "Village", "Pinot Noir", ""

# Open JSON output
with open("cote-d-or-enriched.json", "w", encoding="utf-8") as out_f:
    for feature in data.get("features", []):
        props = feature.setdefault("properties", {})
        denom = props.get("denom", "").strip()
        appellation = props.get("app", "").strip()

        # Default values
        aoc_level = "Village"
        climat_name = ""
        label = ""
        mixed_varietal = False
        secondary_varietal = ""

        denom_lower = denom.lower()

        if is_corton_appellation(appellation):
            aoc_level, varietal, label = process_corton(appellation, denom)
            climat_name = label
        elif is_saint_aubin_appellation(appellation):
            aoc_level, varietal, climat_name, mixed_varietal = process_saint_aubin(denom)
            label = climat_name
        elif is_saint_romain_appellation(appellation):
            aoc_level = "Village"
            varietal = "Chardonnay"
            secondary_varietal = "Pinot Noir"
            mixed_varietal = True
        elif "premier cru" in denom_lower:
            aoc_level = "Premier Cru"
            parts = denom_lower.split("premier cru")
            climat_name = parts[1].strip().title() if len(parts) > 1 else ""
            label = climat_name
            varietal = get_varietal(appellation)
        elif denom_lower in grand_crus:
            aoc_level = "Grand Cru"
            label = denom.title()
            varietal = get_varietal(appellation)
        elif "-villages" in denom_lower:
            aoc_level = "Village"
            varietal = get_varietal(appellation)
        else:
            aoc_level = "Village"
            climat_name = ""
            varietal = get_varietal(appellation)

        props["aoc_level"] = aoc_level
        props["climat"] = climat_name
        props["appellation"] = appellation
        props["varietal"] = varietal
        props["secondary_varietal"] = secondary_varietal
        props["label"] = label
        props["mixed_varietal"] = mixed_varietal

        # do not append if aoc_level premier cru and climat is empty
        if aoc_level == "Premier Cru" and climat_name == "":
            continue
        
        # skip ambiguous grand crus
        if climat_name in ["Charlemagne"]:
            continue

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