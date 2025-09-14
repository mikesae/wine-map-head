import { useEffect, useRef } from "react";
import atlas, { ControlPosition } from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';

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
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Create map
        const map = new atlas.Map(mapRef.current, {
            center: [-0.7445, 45.1976],
            zoom: 10,
            style: "road", // built-in style
            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
            },
            showLogo: true, // Azure Maps logo
            showFeedbackLink: false, // Disable feedback link
            showAttribution: true, // attribution
            enableAccessibility: false, // Disable accessibility control
            enableAccessibilityLocationFallback: false, // Disable accessibility location fallback
        });

        map.events.add("ready", () => {
            // Add zoom/rotation controls
            map.controls.add(new atlas.control.ZoomControl(), {
                position: ControlPosition.TopRight,
            });
            map.controls.add(new atlas.control.CompassControl(), {
                position: ControlPosition.TopRight,
            });

            // // Add contour layer
            // const contourLayer = new atlas.layer.TileLayer({
            //     tileUrl: `https://atlas.microsoft.com/map/tile?api-version=2.1&layer=contour&style=default&zoom={z}&x={x}&y={y}&subscription-key=${import.meta.env.VITE_AZURE_MAPS_KEY}`,
            //     opacity: 0.7, // Adjust opacity
            // });
            // map.layers.add(contourLayer);

            const preprocessMarkers = (markers: Marker[]) => {
                return markers.map((marker) => ({
                    ...marker,
                    region: marker.region || "Unknown", // Default to "Unknown" if region is missing
                }));
            };

            const processedMarkers = preprocessMarkers(markers);

            const datasource = new atlas.source.DataSource("vineyards", {
                cluster: true, // Enable clustering
                clusterRadius: 45, // Adjust the radius for clustering
                clusterMaxZoom: 15, // Maximum zoom level for clustering
                clusterProperties: {
                    region: ["get", "region"], // Assign the "region" property from one of the points in the cluster
                },
            });

            if (processedMarkers.length > 0) {
                datasource.add(
                    processedMarkers.map((m) =>
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
                // iconOptions: {
                //     image: 'wine-glass', // Use a built-in icon
                //     anchor: 'center',
                //     allowOverlap: true,
                //     size: 0.5 // Adjust size as needed
                // },
                textOptions: {
                    textField: ['get', 'name'],
                    offset: [0, 1.2],
                    color: 'purple',
                    font: ['SegoeUi-Bold']
                },
                filter: ['!', ['has', 'point_count']] // Only show individual markers (non-clustered points)
            }));

            // Add a layer for individual markers
            map.layers.add(
                new atlas.layer.SymbolLayer(datasource, "vineyards-individual-markers", {
                    textOptions: {
                        textField: ["get", "name"], // Display the name of the marker
                        color: "gray",
                        font: ["SegoeUi-Bold"],
                        offset: [0, 0.4],
                    },
                    filter: ["!", ["has", "point_count"]], // Only show individual markers (non-clustered points)
                })
            );

            map.layers.add(
                new atlas.layer.SymbolLayer(datasource, "vineyards-cluster-labels", {
                    textOptions: {
                        textField: [
                            "format",
                            "Sites (",
                            ["get", "point_count"], // Display the cluster count
                            ")",
                        ],
                        color: "darkgray",
                        font: ["SegoeUi-Bold"],
                        offset: [0, 0.4],
                    },
                    filter: ["has", "point_count"], // Only show labels for clusters
                })
            );

            map.events.add("click", (e) => {
                if (e.shapes && e.shapes.length > 0) {
                    const cluster = e.shapes[0];
                    console.log("Cluster data:", cluster);
                }
            });
        });

        return () => map.dispose();
    }, [markers]);

    return <div ref={mapRef} id="map" />;
};

export default AzureMap;