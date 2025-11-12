import atlas from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';
import React, { useEffect, useRef } from "react";
import { addDataSource, addFeatureSet, addFillTemplates, addPlacesLabelLayer, addSymbolLayer } from "../data-processing/add-functions";
import type { AzureMapProps } from "../types/mapping";
import events from "./events";
import { addMapControls, createMap } from "./mapping/controls";
import InfoTool from "./InfoTool";
import { createRoot } from "react-dom/client";

const AzureMap: React.FC<AzureMapProps> = ({ markers, regions, places }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = createMap(mapRef.current);
        const popup = new atlas.Popup({
            position: [0, 0],
            pixelOffset: [0, -18]
        });
        map.popups.add(popup);

        map.events.add('mouseup', (e: atlas.MapMouseEvent) => {
            const pixel = e.pixel || [0, 0];
            const latLong = map.pixelsToPositions([pixel]);

            // lookup shapes at this position
            const shapes = map.layers.getRenderedShapes(latLong[0]);
            shapes.forEach((shape) => {
                if (shape instanceof atlas.Shape) {
                    console.log('Shape properties:', shape.getProperties());
                }
            })

            const topShape: any = shapes.length > 0 ? shapes[0] : null;

            // check top shape for properties
            if (typeof topShape.getProperties !== 'function') {
                popup.close();
                return;
            }

            const props = topShape.getProperties();
            const appellation = props && props.hasOwnProperty('appellation') ? props['appellation'] : '';
            const aocLevel = props && props.hasOwnProperty('aoc_level') ? props['aoc_level'] : '';
            const climat = props && props.hasOwnProperty('climat') ? props['climat'] : '';

            // if no relevant properties, close popup and exit
            if (!appellation && !aocLevel && !climat) {
                popup.close();
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
                const root = createRoot(container); // Use createRoot to create a React root
                root.render(
                    <InfoTool appellation={appellation} climat={climat} aocLevel={aocLevel} />
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
            addSymbolLayer(map, myMarkersDataSource, "markers-layer", 'pin-red', false);

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