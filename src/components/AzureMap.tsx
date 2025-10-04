import { useEffect, useRef } from "react";
import atlas from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';
import { addMapControls, createMap } from "./mapping/controls";

export interface Marker {
    name: string;
    latitude: number;
    longitude: number;
    region: string;
}

export interface AzureMapProps {
    markers: Marker[];
    myMarkers: Marker[];
}

function addDataSource(map: atlas.Map, markers: Marker[], sourceId: string): any {
    const dataSource = new atlas.source.DataSource(sourceId, {
        cluster: true, // Enable clustering
        clusterRadius: 45, // Adjust the radius for clustering
        clusterMaxZoom: 15, // Maximum zoom level for clustering
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

function addSymbolLayer(map: atlas.Map, dataSource: atlas.source.DataSource, layerId: string, iconImage: string, individualOnly = true) {
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, layerId, {
        iconOptions: {
            image: iconImage, // Use a built-in icon
            anchor: 'center',
            allowOverlap: true,
            size: 0.5 // Adjust size as needed
        },
        textOptions: {
            textField: ['get', 'name'],
            offset: [0, 2.0],
            color: 'black',
            font: ['SegoeUi-Bold']
        },
        // only filter if individualOnly is true
        filter: individualOnly ? ['!', ['has', 'point_count']] : undefined // Only show individual markers (non-clustered points)
    }));
}

const AzureMap: React.FC<AzureMapProps> = ({ markers, myMarkers }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = createMap(mapRef.current);

        map.events.add("ready", () => {
            addMapControls(map);

            const dataSource = addDataSource(map, markers, "vineyards");
            addSymbolLayer(map, dataSource, "vineyards-layer", 'marker-black', false);

            const myMarkersDataSource = addDataSource(map, myMarkers, "my-wines");
            addSymbolLayer(map, myMarkersDataSource, "my-wines-layer", 'pin-red', false);

        });

        return () => map.dispose();
    }, [markers]);

    return <div ref={mapRef} id="map" />;
};

export default AzureMap;