import atlas from "azure-maps-control";
import { grandCruVarietalColors, premierCruVarietalColors, villageVarietalColors } from "../types/legendColors";
import type { Marker } from "../types/mapping";

export function addDataSource(map: atlas.Map, markers: Marker[], sourceId: string): any {
    const dataSource = new atlas.source.DataSource(sourceId, {
        cluster: false,
        clusterRadius: 45,
        clusterMaxZoom: 15,
    });

    if (markers.length > 0) {
        dataSource.add(
            markers.map((m) =>
                new atlas.data.Feature(
                    new atlas.data.Point([m.longitude, m.latitude]),
                    { ...m, label: m.name }
                )
            )
        );
    }
    map.sources.add(dataSource);
    return dataSource;
}

export function addSymbolLayer(map: atlas.Map, dataSource: atlas.source.DataSource, layerId: string, showLabels: boolean) {
    const individualOnly = false;
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, layerId, {
        iconOptions: {
            image: [
                'match',
                ['get', 'main_varietal'], // Get the 'varietal' property from the data
                'Pinot Noir', 'pinot-noir-varietal', // If 'varietal' is 'pinot noir', use 'pinot-noir-icon'
                'Syrah', 'red-varietal',
                'Cabernet Sauvignon', 'red-varietal',
                'Chardonnay', 'chardonnay-varietal', // If 'varietal' is 'chardonnay', use 'chardonnay-icon'
                'Ribolla Gialla', 'chardonnay-varietal',
                'Riesling', 'chardonnay-varietal',
                'Sparkling', 'sparkling-varietal',
                'default-icon' // Default icon if no match
            ],
            anchor: 'center',
            allowOverlap: true,
            size: 1.5
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

export function addFeatureSet(map: atlas.Map, featureSet: any, layerOpacity: number) {

    // Create a data source for three levels of appellations
    const dataSources: { [key: string]: atlas.source.DataSource } = {};

    dataSources['Village'] = new atlas.source.DataSource(featureSet.name + '-Village');
    dataSources['Premier Cru'] = new atlas.source.DataSource(featureSet.name + '-PremierCru');
    dataSources['Grand Cru'] = new atlas.source.DataSource(featureSet.name + '-GrandCru');
    dataSources['Grand Cru L2'] = new atlas.source.DataSource(featureSet.name + '-GrandCruL2');
    dataSources['Mixed Varietal'] = new atlas.source.DataSource(featureSet.name + '-MixedVarietal');

    map.sources.add(dataSources['Village']);
    map.sources.add(dataSources['Mixed Varietal']);
    map.sources.add(dataSources['Premier Cru']);
    map.sources.add(dataSources['Grand Cru']);
    map.sources.add(dataSources['Grand Cru L2']);

    // Add polygons to the data source
    featureSet.features.forEach((feature: any, idx: number) => {
        if (feature.geometry.type === "MultiPolygon") {
            const coordinates = feature.geometry.coordinates;
            const multiPolygon = new atlas.data.MultiPolygon(coordinates);
            const aoc_level = feature.properties.aoc_level;
            const mixedVarietal = feature.properties.mixed_varietal;
            const atlasFeature = new atlas.data.Feature(multiPolygon, {
                ...feature.properties,
                idx
            });
            // Use separate data source for mixed varietal so we put it in a layer with pattern fill.
            if (mixedVarietal) {
                dataSources['Mixed Varietal'].add(new atlas.Shape(atlasFeature));
            } else if (['Village', 'Premier Cru', 'Grand Cru', 'Grand Cru L2'].includes(aoc_level)) {
                dataSources[aoc_level].add(new atlas.Shape(atlasFeature));
            }
        }
    });
    addRegionLayers(map, dataSources['Village'], featureSet.name, 'Village', villageVarietalColors, layerOpacity);
    addRegionLayers(map, dataSources['Premier Cru'], featureSet.name, 'Premier Cru', premierCruVarietalColors, layerOpacity);
    addMixedLayers(map, dataSources['Mixed Varietal'], featureSet.name, 'Mixed Varietal', layerOpacity);
    addRegionLayers(map, dataSources['Grand Cru'], featureSet.name, 'Grand Cru', grandCruVarietalColors, layerOpacity);
    addRegionLayers(map, dataSources['Grand Cru L2'], featureSet.name, 'Grand Cru L2', grandCruVarietalColors, layerOpacity);

    // Add label layers last so they are on top.
    // Note: none for village level
    addRegionLabelLayer(map, dataSources['Premier Cru'], featureSet.name + 'Premier Cru', 11);
    addRegionLabelLayer(map, dataSources['Mixed Varietal'], featureSet.name + 'Mixed Varietal', 11);
    addRegionLabelLayer(map, dataSources['Grand Cru'], featureSet.name + 'Grand Cru', 13, true);
    addRegionLabelLayer(map, dataSources['Grand Cru L2'], featureSet.name + 'Grand Cru L2', 14, true);
}

function addMixedLayers(map: atlas.Map, dataSource: atlas.source.DataSource, featureSetName: string, aocLevel: string, layerOpacity: number) {
    // Add a polygon layer for mixed varietals using hatch pattern

    const polygonLayerName = "layer-" + featureSetName + '-' + aocLevel;
    const polygonLayer = new atlas.layer.PolygonLayer(dataSource, polygonLayerName,
        {
            source: dataSource, // your polygon datasource
            fillPattern: [
                'case',
                ['==', ['get', 'aoc_level'], 'Village'], 'Village-Mixed',
                ['==', ['get', 'aoc_level'], 'Premier Cru'], 'PremierCru-Mixed',
                // Default fill pattern
                ''
            ],
            fillOpacity: layerOpacity / 100,
        });

    // Add a line layer for polygon borders
    const lineLayer = new atlas.layer.LineLayer(dataSource, "line-layer-" + featureSetName + '-' + aocLevel, {
        strokeColor: '#BBBBBB',
        strokeWidth: 1,
        strokeOpacity: layerOpacity / 100,
        minZoom: 12
    });

    map.layers.add(polygonLayer);
    map.layers.add(lineLayer);
}

export async function addFillTemplates(map: atlas.Map) {
    const scale = 0.333;
    await map.imageSprite.createFromTemplate('Village-Mixed', 'diagonal-lines-up', villageVarietalColors.Mixed, villageVarietalColors.Chardonnay, scale);
    await map.imageSprite.createFromTemplate('PremierCru-Mixed', 'diagonal-lines-up', premierCruVarietalColors.Mixed, premierCruVarietalColors.Chardonnay, scale);
    await map.imageSprite.add('pinot-noir-varietal', '/icons/pinot-noir-varietal.svg');
    await map.imageSprite.add('chardonnay-varietal', '/icons/chardonnay-varietal.svg');
    await map.imageSprite.add('red-varietal', '/icons/red-varietal.svg');
    await map.imageSprite.add('sparkling-varietal', '/icons/sparkling-varietal.svg');
}

function addRegionLayers(map: atlas.Map, dataSource: atlas.source.DataSource, featureSetName: string, aocLevel: string, colors: any, layerOpacity: number) {
    // Add a polygon layer
    map.layers.add(new atlas.layer.PolygonLayer(dataSource, "region-layer-" + featureSetName + '-' + aocLevel, {
        fillColor: [
            'case',
            ['==', ['get', 'varietal'], 'Chardonnay'], colors.Chardonnay,
            ['==', ['get', 'varietal'], 'Pinot Noir'], colors.PinotNoir,
            ['==', ['get', 'varietal'], 'Aligoté'], colors.Aligote,
            // Default color
            'transparent'
        ],
        fillOpacity: layerOpacity / 100
    }));
    // Add a line layer for polygon borders
    map.layers.add(new atlas.layer.LineLayer(dataSource, "line-layer-" + featureSetName + '-' + aocLevel, {
        strokeColor: '#BBBBBB',
        strokeWidth: 1,
        strokeOpacity: layerOpacity / 100,
        minZoom: 12
    }));
}

export function addRegionLabelLayer(map: atlas.Map, dataSource: atlas.source.DataSource, name: string, labelSize: number, bold: boolean = false) {
    // Add a layer for labels
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, "label-layer-" + name, {
        minZoom: 12,
        iconOptions: {
            image: ""
        },
        textOptions: {
            //no label if 'label' property is missing
            textField: ['get', 'label'],
            offset: [0, 0],
            color: bold ? '#404040' : '#808080',
            haloColor: 'white',
            haloWidth: 1,
            font: [bold ? 'StandardCondensedSegoeUi-Bold' : 'StandardCondensedSegoeUi-Regular'],
            size: labelSize,
            allowOverlap: false,
        }
    }));
}

export function addPlacesLabelLayer(map: atlas.Map, dataSource: atlas.source.DataSource, name: string, labelSize: number = 18, visible: boolean = true) {
    // Add a layer for labels
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, "label-layer-" + name, {
        minZoom: 0,
        maxZoom: 24,
        iconOptions: {
            image: ""
        },
        textOptions: {
            textField: ['get', 'label'],
            offset: [0, 0],
            color: [
                'match',
                ['get', 'region'],
                'Champagne', 'purple',
                'Bordeaux', 'blue',
                'Bourgogne', 'red',
                'gray'
            ],
            haloColor: 'white',
            haloWidth: 1,
            font: ['StandardCondensedSegoeUi-Regular'],
            size: labelSize,
            allowOverlap: false,
        },
        // set sortkey so higher population places are on top
        sortKey: ['get', 'sortKey'],
        visible: visible,
    }));
}
