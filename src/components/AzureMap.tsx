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

const AzureMap: React.FC<AzureMapProps> = ({ markers, myMarkers }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = createMap(mapRef.current);

        map.events.add("ready", () => {
            addMapControls(map);

            const datasource = new atlas.source.DataSource("vineyards", {
                cluster: true, // Enable clustering
                clusterRadius: 45, // Adjust the radius for clustering
                clusterMaxZoom: 15, // Maximum zoom level for clustering
                clusterProperties: {
                    region: ["get", "region"], // Assign the "region" property from one of the points in the cluster
                },
            });

            if (markers.length > 0) {
                datasource.add(
                    markers.map((m) =>
                        new atlas.data.Feature(
                            new atlas.data.Point([m.longitude, m.latitude]),
                            { name: m.name, region: m.region }
                        )
                    )
                );
            }
            map.sources.add(datasource);

            const myMarkersDataSource = new atlas.source.DataSource("my-wines", {
                cluster: true,
                clusterRadius: 45,
                clusterMaxZoom: 5
            });
            if (myMarkers.length > 0) {
                myMarkersDataSource.add(
                    myMarkers.map((m) =>
                        new atlas.data.Feature(
                            new atlas.data.Point([m.longitude, m.latitude]),
                            { name: m.name, region: m.region }
                        )
                    )
                );
            }
            map.sources.add(myMarkersDataSource);
            map.layers.add(new atlas.layer.SymbolLayer(myMarkersDataSource, "my-wines-individual-markers", {
                iconOptions: {
                    image: 'marker-black', // Use a built-in icon
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
                filter: ['!', ['has', 'point_count']] // Only show individual markers (non-clustered points)
            }));

            // Add a layer for individual markers
            map.layers.add(
                new atlas.layer.SymbolLayer(datasource, "vineyards-individual-markers", {
                    iconOptions: {
                        image: 'pin-darkblue', // Use a built-in icon
                        anchor: 'center',
                        allowOverlap: true,
                        size: 0.8 // Adjust size as needed
                    },
                    textOptions: {
                        textField: ["get", "name"], // Display the name of the marker
                        color: "darkblue",
                        font: ["SegoeUi-Bold"],
                        offset: [0, 0.9],
                    },
                    filter: ["!", ["has", "point_count"]], // Only show individual markers (non-clustered points)
                })
            );

            map.layers.add(
                new atlas.layer.SymbolLayer(datasource, "vineyards-cluster-labels", {
                    iconOptions: {
                        image: 'pin-darkblue', // Use a built-in icon
                        anchor: 'center',
                        allowOverlap: true,
                        size: 1 // Adjust size as needed
                    },
                    textOptions: {
                        textField: [
                            "format",
                            "Sites (",
                            ["get", "point_count"], // Display the cluster count
                            ")",
                        ],
                        color: "darkblue",
                        font: ["SegoeUi-Bold"],
                        offset: [0, 1],
                    },
                    filter: ["has", "point_count"], // Only show labels for clusters
                })
            );
        });

        return () => map.dispose();
    }, [markers]);

    return <div ref={mapRef} id="map" />;
};

export default AzureMap;