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