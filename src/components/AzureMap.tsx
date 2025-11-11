import atlas from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';
import { useEffect, useRef } from "react";
import { addDataSource, addFeatureSet, addFillTemplates, addPlacesLabelLayer, addSymbolLayer } from "../data-processing/add-functions";
import type { AzureMapProps } from "../types/mapping";
import events from "./events";
import { addMapControls, createMap } from "./mapping/controls";
import { villageVarietalColors } from "../types/legendColors";

const AzureMap: React.FC<AzureMapProps> = ({ markers, regions, places }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = createMap(mapRef.current);

        map.events.add('mouseup', (e: atlas.MapMouseEvent) => {
            const pixel = e.pixel || [0, 0];
            const latLong = map.pixelsToPositions([pixel]);
            console.log('Clicked at latitude/longitude:', latLong[0]);

            // lookup shapes at this position
            const shapes = map.layers.getRenderedShapes(latLong[0]);
            shapes.forEach((shape) => {
                if (shape instanceof atlas.Shape) {
                    console.log('Shape properties:', shape.getProperties());
                }
            })
        });

        map.events.add("ready", async () => {

            addMapControls(map);
            await addFillTemplates(map, villageVarietalColors.PinotNoir);

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