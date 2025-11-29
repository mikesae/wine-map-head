import atlas from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { addDataSource, addFeatureSet, addFillTemplates, addPlacesLabelLayer, addSymbolLayer } from "../data-processing/add-functions";
import { useMapStore } from "../hooks/useMapStore";
import type { AzureMapProps } from "../types/mapping";
import events from "./events";
import InfoTool from "./InfoTool";
import { addMapControls, createMap } from "./mapping/controls";

const AzureMap: React.FC<AzureMapProps> = ({ markers, regions, places }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    // Store the root instance globally or in a closure
    let infoToolRoot: ReturnType<typeof createRoot> | null = null;
    const { center, zoom, bearing, pitch, layerOpacity } = useMapStore();

    useEffect(() => {
        if (!mapRef.current) return;

        let map: atlas.Map;
        const params = new URLSearchParams(window.location.search);

        if (params.has("lat") && params.has("lng")) {
            const lat = parseFloat(params.get("lat") || "47.14046061394379"); // Default to Nuit-St-Georges if not provided
            const lng = parseFloat(params.get("lng") || "4.947624206669559"); // Default to Nuit-St-Georges if not provided
            const zoom = parseFloat(params.get("zoom") || "12"); // Default to zoom level 12 if not provided
            const bearing = parseFloat(params.get("bearing") || "290"); // Default to bearing 0 if not provided
            const pitch = parseFloat(params.get("pitch") || "0"); // Default to pitch 0 if not provided

            map = createMap(mapRef.current, lat, lng, zoom, bearing);
            map.setCamera({ pitch: pitch });

        } else {
            const [lng, lat] = center;

            map = createMap(mapRef.current, lat, lng, zoom, bearing);
            map.setCamera({ pitch: pitch });
        }

        const popup = new atlas.Popup({
            position: [0, 0],
            pixelOffset: [0, -18]
        });
        map.popups.add(popup);

        // function to update map settings in the store
        function updateMapSettings() {
            const camera = map.getCamera();
            useMapStore.getState().setMapSettings({
                center: camera.center as [number, number],
                zoom: camera.zoom as number,
                bearing: camera.bearing as number,
                pitch: camera.pitch as number,
            });
        }

        function updateLayerOpacityInStore(opacity: number) {
            useMapStore.getState().setMapSettings({
                layerOpacity: opacity,
            });
        }

        // trap map zoom, pan, and bearing changes to update the store
        map.events.add('moveend', () => {
            updateMapSettings();
        });
        map.events.add('zoomend', () => {
            updateMapSettings();
        });
        map.events.add('pitchend', () => {
            updateMapSettings();
        });
        map.events.add('rotateend', () => {
            updateMapSettings();
        });
        map.events.add('wheel', () => {
            updateMapSettings();
        });

        let mouseDownPosition: [number, number] | null = null;
        const CLICK_THRESHOLD = 5; // Maximum distance in pixels to consider it a click

        // Track the mouse down position
        map.events.add('mousedown', (e: atlas.MapMouseEvent) => {
            mouseDownPosition = e.pixel ? [e.pixel[0], e.pixel[1]] : null;
        });

        map.events.add('mouseup', (e: atlas.MapMouseEvent) => {
            const mouseUpPosition = e.pixel || null;

            if (mouseDownPosition && mouseUpPosition) {
                const dx = mouseUpPosition[0] - mouseDownPosition[0];
                const dy = mouseUpPosition[1] - mouseDownPosition[1];
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= CLICK_THRESHOLD) {
                    const pixel = e.pixel || [0, 0];
                    const latLong = map.pixelsToPositions([pixel]);
                    console.log(`"latitude": ${latLong[0][1]}`);
                    console.log(`"longitude": ${latLong[0][0]}`);

                    // lookup shapes at this position
                    const shapes = e.shapes || [];
                    shapes.forEach((shape) => {
                        if (shape instanceof atlas.Shape) {
                            console.log('Shape properties:', shape.getProperties());
                        }
                    })

                    const topShape: any = shapes.length > 0 ? shapes[0] : null;
                    if (!topShape.dataSource) {
                        return;
                    }

                    // Inside your component or function
                    popup.setOptions({
                        position: latLong[0],
                        content: `<div id="info-tool-container"></div>`,
                    });

                    // Render the InfoTool component dynamically
                    const container = document.getElementById("info-tool-container");
                    if (container) {
                        if (!infoToolRoot) {
                            // Create the root only once
                            infoToolRoot = createRoot(container);
                        }
                        // Use the existing root to render or update the component
                        infoToolRoot.render(
                            <InfoTool shape={topShape} event={e} />
                        );
                    }
                    popup.open(map);
                }
            }
        });

        map.events.add("ready", async () => {

            addMapControls(map);
            await addFillTemplates(map);

            regions.forEach((region) => {
                addFeatureSet(map, region, layerOpacity);
            });

            const myMarkersDataSource = addDataSource(map, markers, "markers");
            addSymbolLayer(map, myMarkersDataSource, "markers-layer", false);

            const placesDataSource = addDataSource(map, places, "places");
            addPlacesLabelLayer(map, placesDataSource, "places");
        });

        // Subscribe to the recenter event
        const handleRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
            // Update the map's center
            map.setCamera({
                center: [lng, lat], // Azure Maps uses [longitude, latitude]
                zoom: 12, // Optional: Adjust zoom level,
                type: 'fly', // Optional: Animation type
                duration: 1000 // Optional: Animation duration in milliseconds
            });
        };

        events.on('recenter', handleRecenter);
        events.on('setLayerOpacity', (opacity: number) => {
            const layers = map.layers.getLayers();
            // walk layers and set opacity for relevant layers
            layers.forEach((layer) => {
                const id = layer.getId();
                if (id.includes('region-layer-')) {
                    layer.setOptions({
                        fillOpacity: opacity / 100
                    });
                } else if (id.includes('line-layer-')) {
                    layer.setOptions({
                        strokeOpacity: opacity / 100
                    });
                }
            });
            updateLayerOpacityInStore(opacity);
        });

        return () => {
            events.off('recenter', handleRecenter);
            map.dispose();
        }
    }, [markers, regions]);

    return <div ref={mapRef} id="map" />;
};

export default AzureMap;