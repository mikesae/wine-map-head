import atlas from "azure-maps-control";
import 'azure-maps-control/dist/atlas.min.css';
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { addDataSource, addFeatureSet, addFillTemplates, addPlacesLabelLayer, addSymbolLayer } from "../data-processing/add-functions";
import { useMapStore } from "../hooks/useMapStore";
import type { AzureMapProps } from "../types/mapping";
import events from "./events";
import InfoTool from "./InfoTool";
import { addMapControls, adjustLayerOrder, createMap } from "./mapping/controls";
import bordeauxDataUrl from '../assets/data/bordeaux-enriched.json?url';

// Envelope of the Bordeaux appellations, available without loading their geometry.
const bordeauxBounds = atlas.data.BoundingBox.fromEdges(-1.1, 44, 0.9, 45.5);

const AzureMap: React.FC<AzureMapProps> = ({ markers, regions, places }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [bordeauxStatus, setBordeauxStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const { center, zoom, bearing, pitch, mapType, layerOpacity, showPlaceNames } = useMapStore();

    useEffect(() => {
        if (!mapRef.current) return;

        let infoToolRoot: ReturnType<typeof createRoot> | null = null;
        let map: atlas.Map;
        const params = new URLSearchParams(window.location.search);

        if (params.has("lat") && params.has("lng")) {
            const lat = parseFloat(params.get("lat") || "47.14046061394379"); // Default to Nuit-St-Georges if not provided
            const lng = parseFloat(params.get("lng") || "4.947624206669559"); // Default to Nuit-St-Georges if not provided
            const zoom = parseFloat(params.get("zoom") || "12"); // Default to zoom level 12 if not provided
            const bearing = parseFloat(params.get("bearing") || "290"); // Default to bearing 0 if not provided
            const pitch = parseFloat(params.get("pitch") || "0"); // Default to pitch 0 if not provided

            map = createMap(mapRef.current, lat, lng, zoom, bearing, mapType);
            map.setCamera({ pitch: pitch });

        } else {
            const [lng, lat] = center;

            map = createMap(mapRef.current, lat, lng, zoom, bearing, mapType);
            map.setCamera({ pitch: pitch });
        }

        const popup = new atlas.Popup({
            position: [0, 0],
            pixelOffset: [0, -18]
        });
        map.popups.add(popup);

        const bordeauxRequest = new AbortController();
        let disposed = false;
        let bordeauxLoaded = false;
        let bordeauxLoading = false;

        async function loadBordeauxIfVisible() {
            const bounds = map.getCamera().bounds;
            if (disposed || bordeauxLoaded || bordeauxLoading || !bounds || !atlas.data.BoundingBox.intersect(bounds, bordeauxBounds)) {
                return;
            }

            bordeauxLoading = true;
            setBordeauxStatus('loading');
            try {
                const response = await fetch(bordeauxDataUrl, { signal: bordeauxRequest.signal });
                if (!response.ok) {
                    throw new Error(`Bordeaux data request failed: ${response.status}`);
                }
                const bordeaux: atlas.data.FeatureCollection = await response.json();
                if (disposed) return;

                addFeatureSet(map, bordeaux, useMapStore.getState().layerOpacity);
                // Keep newly loaded polygons below wine markers and place names.
                map.layers.getLayers().forEach((layer) => {
                    if (layer.getId().includes('bordeaux')) {
                        map.layers.move(layer, 'markers-layer');
                    }
                });
                bordeauxLoaded = true;
                adjustLayerOrder(map);
                setBordeauxStatus('idle');
            } catch (error) {
                if (!disposed) {
                    console.error('Error loading Bordeaux polygons:', error);
                    setBordeauxStatus('error');
                }
            } finally {
                bordeauxLoading = false;
            }
        }

        const regionBounds = regions.map((region) => ({
            name: region.name,
            bounds: atlas.data.BoundingBox.fromData(region),
        }));
        regionBounds.push({ name: 'bordeaux', bounds: bordeauxBounds });

        // function to update map settings in the store
        function updateMapSettings() {
            const camera = map.getCamera();
            const bounds = camera.bounds;
            const visibleRegions = bounds
                ? regionBounds.filter((region) => atlas.data.BoundingBox.intersect(bounds, region.bounds))
                : [];
            useMapStore.getState().setMapSettings({
                center: camera.center as [number, number],
                zoom: camera.zoom as number,
                bearing: camera.bearing as number,
                pitch: camera.pitch as number,
                showBordeauxLegend: visibleRegions.length > 0 && visibleRegions.every((region) => region.name === 'bordeaux'),
            });
        }

        function updateLayerOpacityInStore(opacity: number) {
            useMapStore.getState().setMapSettings({
                layerOpacity: opacity,
            });
        }

        function updateMapTypeInStore(event: atlas.StyleChangedEvent) {
            useMapStore.getState().setMapSettings({
                mapType: event.style,
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
        map.events.add('stylechanged', updateMapTypeInStore);

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

            updateMapSettings();

            addMapControls(map);
            await addFillTemplates(map);
            if (disposed) return;

            regions.forEach((region) => {
                addFeatureSet(map, region, layerOpacity);
            });

            const myMarkersDataSource = addDataSource(map, markers, "markers");
            addSymbolLayer(map, myMarkersDataSource, "markers-layer", false);

            const placesDataSource = addDataSource(map, places, "places");
            addPlacesLabelLayer(map, placesDataSource, "places", 22, showPlaceNames);

            adjustLayerOrder(map);
            map.events.add('moveend', loadBordeauxIfVisible);
            void loadBordeauxIfVisible();
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
            updateLayerOpacity(map, opacity);
            updateLayerOpacityInStore(opacity);
        });
        events.on('togglePlaceNames', (showPlaceNames: boolean) => {
            let labelsLayer: any | null = null;
            const allLayers = map.layers.getLayers();
            allLayers.forEach((layer) => {
                const id = layer.getId();
                if (id === 'label-layer-places') {
                    labelsLayer = layer;
                }
            });

            if (labelsLayer) {
                labelsLayer.setOptions({
                    visible: showPlaceNames
                });
            }

            useMapStore.getState().setMapSettings({
                showPlaceNames: showPlaceNames,
            });
        });

        return () => {
            disposed = true;
            bordeauxRequest.abort();
            map.events.remove('moveend', loadBordeauxIfVisible);
            events.off('recenter', handleRecenter);
            infoToolRoot?.unmount();
            map.dispose();
        }
    }, [markers, regions]);

    return <>
        <div ref={mapRef} id="map" />
        {bordeauxStatus !== 'idle' && (
            <div role="status" className="absolute top-2 left-1/2 -translate-x-1/2 z-40 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-md">
                {bordeauxStatus === 'loading' ? 'Loading Bordeaux polygons…' : 'Unable to load Bordeaux polygons. Move the map to retry.'}
            </div>
        )}
    </>;
};

function updateLayerOpacity(map: atlas.Map, opacity: number) {
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
        } else if (id === 'labels') {
            console.log(`Layer ${id} found`);
        }
    });
}

export default AzureMap;
