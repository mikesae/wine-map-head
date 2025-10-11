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
    regions: any; // Add aocs.json data as a prop
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

function addPolygonLayer(map: atlas.Map, features: any) {
    const dataSource = new atlas.source.DataSource("aocs-polygons");
    map.sources.add(dataSource);

    // Add polygons to the data source
    features.forEach((feature: any) => {
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
    map.layers.add(new atlas.layer.PolygonLayer(dataSource, "aocs-polygon-layer", {
        fillColor: "rgba(128, 0, 128, 0.8)", // Semi-transparent purple
        strokeColor: "blue",
        strokeWidth: 3,
    }));

    // Add a symbol layer for labels
    // map.layers.add(new atlas.layer.SymbolLayer(dataSource, "aocs-label-layer", {
    //     textOptions: {
    //         textField: ['get', 'denom'],
    //         offset: [0, 1.5],
    //         color: 'black',
    //         font: ['SegoeUi-Bold'],
    //         size: 14,
    //     },
    // }));
}

const AzureMap: React.FC<AzureMapProps> = ({ markers, myMarkers, regions }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = createMap(mapRef.current);

        map.events.add("ready", () => {
            addMapControls(map);

            addPolygonLayer(map, regions);

            const dataSource = addDataSource(map, markers, "vineyards");
            addSymbolLayer(map, dataSource, "vineyards-layer", 'marker-black', false);

            const myMarkersDataSource = addDataSource(map, myMarkers, "my-wines");
            addSymbolLayer(map, myMarkersDataSource, "my-wines-layer", 'pin-red', false);
        });

        return () => map.dispose();
    }, [markers, myMarkers, regions]);

    return <div ref={mapRef} id="map" />;
};

export default AzureMap;