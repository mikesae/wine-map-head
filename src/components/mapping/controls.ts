import atlas, { ControlPosition } from "azure-maps-control";

export function addMapControls(map: atlas.Map) {
    // Add zoom/rotation controls
    map.controls.add(new atlas.control.ZoomControl(), {
        position: ControlPosition.TopRight,
    });
    map.controls.add(new atlas.control.CompassControl(), {
        position: ControlPosition.TopRight,
    });

    map.controls.add(new atlas.control.ScaleControl({ unit: "imperial" }), {
        position: ControlPosition.BottomRight,
    });
    map.controls.add(
        new atlas.control.StyleControl({
            mapStyles: ["road_shaded_relief", "satellite", "satellite_road_labels"]
        }),
        { position: atlas.ControlPosition.TopRight }
    );
}

export function adjustLayerOrder(map: atlas.Map) {
    // move the basemap "labels" layer to be before the current topmost layer
    const layers = map.layers.getLayers();
    const layerBelowTop = layers[layers.length - 2];

    if (layerBelowTop) {
        map.layers.move("labels", layerBelowTop); // inserts "labels" before the top layer (i.e. makes labels topmost)
    }
}

// Function to create the map
export const createMap = (element: HTMLDivElement, lat: number, lon: number, zoom: number, bearing: number) => {
    return new atlas.Map(element, {
        center: [lon, lat],
        zoom: zoom,
        view: "Auto",
        bearing: bearing,
        style: "road_shaded_relief", // built-in style
        styleOverrides: {
            roadDetails: { visible: false },
            adminDistrict: { borderVisible: true },
            adminDistrict2: { borderVisible: true },
            countryRegion: { borderVisible: true },

        },
        authOptions: {
            authType: atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
        },
        showLabels: true, // Disable default labels
        showLogo: false, // Azure Maps logo
        showFeedbackLink: false, // Disable feedback link
        showAttribution: true, // attribution
        enableAccessibility: false, // Disable accessibility control
        enableAccessibilityLocationFallback: false, // Disable accessibility location fallback
    });
};