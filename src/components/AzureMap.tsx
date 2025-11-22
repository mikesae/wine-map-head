import atlas from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { addDataSource, addFeatureSet, addFillTemplates, addPlacesLabelLayer, addSymbolLayer } from "../data-processing/add-functions";
import type { AzureMapProps } from "../types/mapping";
import events from "./events";
import { addMapControls, createMap } from "./mapping/controls";
import InfoTool from "./InfoTool";

const AzureMap: React.FC<AzureMapProps> = ({ markers, regions, places }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    // Store the root instance globally or in a closure
    let infoToolRoot: ReturnType<typeof createRoot> | null = null;

    useEffect(() => {
        if (!mapRef.current) return;

        // Parse URL parameters
        const params = new URLSearchParams(window.location.search);
        const lat = parseFloat(params.get("lat") || "47.14046061394379"); // Default to Nuit-St-Georges if not provided
        const lng = parseFloat(params.get("lng") || "4.947624206669559"); // Default to Nuit-St-Georges if not provided
        const zoom = parseFloat(params.get("zoom") || "12"); // Default to zoom level 12 if not provided
        const bearing = parseFloat(params.get("bearing") || "290"); // Default to bearing 0 if not provided

        const map = createMap(mapRef.current, lat, lng, zoom, bearing);
        const popup = new atlas.Popup({
            position: [0, 0],
            pixelOffset: [0, -18]
        });
        map.popups.add(popup);

        map.events.add('mouseup', (e: atlas.MapMouseEvent) => {
            const pixel = e.pixel || [0, 0];
            const latLong = map.pixelsToPositions([pixel]);
            console.log('Map clicked at latitude/longitude:', latLong[0]);

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
        });

        map.events.add("ready", async () => {

            addMapControls(map);
            await addFillTemplates(map);

            regions.forEach((region) => {
                addFeatureSet(map, region);
            });

            const myMarkersDataSource = addDataSource(map, markers, "markers");
            addSymbolLayer(map, myMarkersDataSource, "markers-layer", 'RedWineBottle', false);

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

        return () => {
            events.off('recenter', handleRecenter);
            map.dispose();
        }
    }, [markers, regions]);

    return <div ref={mapRef} id="map" />;
};

export default AzureMap;