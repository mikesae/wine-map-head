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
    map.controls.add(new atlas.control.StyleControl(), {
        position: ControlPosition.TopRight,
    });
}

// Function to create the map
export const createMap = (element: HTMLDivElement) => {
    return new atlas.Map(element, {
        center: [4.7833, 47.0033],
        zoom: 10,
        style: "road_shaded_relief", // built-in style
        styleOverrides: {
            roadDetails: { visible: false }, // Hide road details
        },
        authOptions: {
            authType: atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
        },
        showLogo: false, // Azure Maps logo
        showFeedbackLink: false, // Disable feedback link
        showAttribution: true, // attribution
        enableAccessibility: false, // Disable accessibility control
        enableAccessibilityLocationFallback: false, // Disable accessibility location fallback
    });
};