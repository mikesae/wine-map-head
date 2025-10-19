import { useEffect, useRef } from "react";
import atlas from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';
import { addMapControls, createMap } from "./mapping/controls";
import events from "./events";

export interface Marker {
    name: string;
    latitude: number;
    longitude: number;
    region: string;
}

export interface AzureMapProps {
    markers: Marker[];
    regions: any[];
}

function addDataSource(map: atlas.Map, markers: Marker[], sourceId: string): any {
    const dataSource = new atlas.source.DataSource(sourceId, {
        cluster: true,
        clusterRadius: 45,
        clusterMaxZoom: 15,
    });

    if (markers.length > 0) {
        dataSource.add(
            markers.map((m) =>
                new atlas.data.Feature(
                    new atlas.data.Point([m.longitude, m.latitude]),
                    { name: m.name, region: m.region }
                )
            )
        );
    }
    map.sources.add(dataSource);
    return dataSource;
}

function addSymbolLayer(map: atlas.Map, dataSource: atlas.source.DataSource, layerId: string, iconImage: string, showLabels: boolean) {
    const individualOnly = false;
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, layerId, {
        iconOptions: {
            image: iconImage,
            anchor: 'center',
            allowOverlap: true,
            size: 1.0
        },
        textOptions: showLabels ? {
            textField: ['get', 'name'],
            offset: [0, 2.0],
            color: 'black',
            font: ['SegoeUi-Bold'],
            allowOverlap: true,
        } : undefined,
        filter: individualOnly ? ['!', ['has', 'point_count']] : undefined
    }));
}

// color fills for regions
const regionColors = [
    "rgba(128,  0,  128, 0.8)", // Semi-transparent purple
    "rgba(   0, 192,  0, 0.8)",
    "rgba(255,  215,  0, 0.8)", // Semi-transparent gold
];

function addPolygonLayer(map: atlas.Map, featureSet: any, color?: string) {
    const dataSource = new atlas.source.DataSource(featureSet.name);
    map.sources.add(dataSource);

    // Add polygons to the data source
    featureSet.features.forEach((feature: any) => {
        if (feature.geometry.type === "MultiPolygon") {
            const coordinates = feature.geometry.coordinates;
            coordinates.forEach((polygonCoords: any) => {
                const polygon = new atlas.data.Polygon(polygonCoords[0]);
                const atlasFeature = new atlas.data.Feature(polygon);
                dataSource.add(new atlas.Shape(atlasFeature));
            });
        }
    });

    // Add a polygon layer
    map.layers.add(new atlas.layer.PolygonLayer(dataSource, "layer-" + featureSet.name, {
        fillColor: color
    }));
}

const AzureMap: React.FC<AzureMapProps> = ({ markers, regions }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = createMap(mapRef.current);

        map.events.add('mouseup', (e: atlas.MapMouseEvent) => {
            const pixel = e.pixel || [0, 0];
            const ll = map.pixelsToPositions([pixel]);
            console.log(`Mouse at: ${ll[0][1]}, ${ll[0][0]}`); // Latitude, Longitude
        });

        map.events.add("ready", () => {
            addMapControls(map);

            regions.forEach((region, index) => {
                addPolygonLayer(map, region, regionColors[index]);
            });

            const myMarkersDataSource = addDataSource(map, markers, "markers");
            addSymbolLayer(map, myMarkersDataSource, "markers-layer", 'pin-red', false);
        });

        // Subscribe to the recenter event
        const handleRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
            console.log('Recenter map to:', lat, lng);

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