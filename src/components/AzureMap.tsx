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
    myMarkers: Marker[];
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

function addSymbolLayer(map: atlas.Map, dataSource: atlas.source.DataSource, layerId: string, iconImage: string, individualOnly: boolean) {
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, layerId, {
        iconOptions: {
            image: iconImage,
            anchor: 'center',
            allowOverlap: true,
            size: 0.5
        },
        textOptions: {
            textField: ['get', 'name'],
            offset: [0, 2.0],
            color: 'black',
            font: ['SegoeUi-Bold']
        },
        filter: individualOnly ? ['!', ['has', 'point_count']] : undefined
    }));
}

function addPolygonLayer(map: atlas.Map, featureSet: any) {
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
        fillColor: "rgba(128, 0, 128, 0.8)" // Semi-transparent purple
    }));
}

const AzureMap: React.FC<AzureMapProps> = ({ markers, myMarkers, regions }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = createMap(mapRef.current);

        map.events.add("ready", () => {
            addMapControls(map);

            regions.forEach((region) => {
                addPolygonLayer(map, region);
            });

            const dataSource = addDataSource(map, markers, "vineyards");
            addSymbolLayer(map, dataSource, "vineyards-layer", 'marker-black', false);

            const myMarkersDataSource = addDataSource(map, myMarkers, "my-wines");
            addSymbolLayer(map, myMarkersDataSource, "my-wines-layer", 'pin-red', false);
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
    }, [markers, myMarkers, regions]);

    return <div ref={mapRef} id="map" />;
};

export default AzureMap;