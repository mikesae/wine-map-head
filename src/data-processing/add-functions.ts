import atlas from "azure-maps-control";
import type { Marker } from "../types/map-stuff";

const vinsBlancs = {
    GrandCru: '#ffff59',
    PremierCru: '#ffcd54',
    Village: '#fff171'
};

const vinsRouges = {
    GrandCru: '#ef4865',
    PremierCru: '#c475b0',
    Village: '#fb766d',
}

const fillOpacity = {
    GrandCru: 1.0,
    PremierCru: 0.8,
    Village: 0.6
}

const grandCruVarietalColors = {
    Chardonnay: vinsBlancs.GrandCru,
    PinotNoir: vinsRouges.GrandCru
}

const premierCruVarietalColors = {
    Chardonnay: vinsBlancs.PremierCru,
    PinotNoir: vinsRouges.PremierCru
}

const villageVarietalColors = {
    Chardonnay: vinsBlancs.Village,
    PinotNoir: vinsRouges.Village
}

const mixedColor = '#C08040'; // blend of purple and yellow

export function addDataSource(map: atlas.Map, markers: Marker[], sourceId: string): any {
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

export function addSymbolLayer(map: atlas.Map, dataSource: atlas.source.DataSource, layerId: string, iconImage: string, showLabels: boolean) {
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

export function addFeatureSet(map: atlas.Map, featureSet: any) {

    // Create a data source for three levels of appellations
    const dataSources: { [key: string]: atlas.source.DataSource } = {};

    dataSources['Village'] = new atlas.source.DataSource(featureSet.name + '-Village');
    dataSources['Premier Cru'] = new atlas.source.DataSource(featureSet.name + '-PremierCru');
    dataSources['Grand Cru'] = new atlas.source.DataSource(featureSet.name + '-GrandCru');

    map.sources.add(dataSources['Village']);
    map.sources.add(dataSources['Premier Cru']);
    map.sources.add(dataSources['Grand Cru']);

    // Add polygons to the data source
    featureSet.features.forEach((feature: any) => {
        if (feature.geometry.type === "MultiPolygon") {
            const coordinates = feature.geometry.coordinates;
            const multiPolygon = new atlas.data.MultiPolygon(coordinates);
            const aoc_level = feature.properties.aoc_level;
            const atlasFeature = new atlas.data.Feature(multiPolygon, {
                aoc_level: aoc_level,
                appellation: feature.properties.appellation,
                climat: feature.properties.climat,
                varietal: feature.properties.varietal,
                label: feature.properties.label
            });
            if (['Village', 'Premier Cru', 'Grand Cru'].includes(aoc_level)) {
                dataSources[aoc_level].add(new atlas.Shape(atlasFeature));
            }
        }
    });
    addRegionLayers(map, dataSources['Village'], featureSet.name, 'Village', villageVarietalColors);
    addRegionLayers(map, dataSources['Premier Cru'], featureSet.name, 'Premier Cru', premierCruVarietalColors);
    addRegionLayers(map, dataSources['Grand Cru'], featureSet.name, 'Grand Cru', grandCruVarietalColors);

    // Add label layers last so they are on top.
    // Note: none for village level
    addLabelLayer(map, dataSources['Premier Cru'], featureSet.name, 'Premier Cru', 11);
    addLabelLayer(map, dataSources['Grand Cru'], featureSet.name, 'Grand Cru', 13);
}

function addRegionLayers(map: atlas.Map, dataSource: atlas.source.DataSource, featureSetName: string, aocLevel: string, colors: any) {
    // Add a polygon layer
    map.layers.add(new atlas.layer.PolygonLayer(dataSource, "layer-" + featureSetName + '-' + aocLevel, {
        fillColor: [
            'case',
            ['==', ['get', 'varietal'], 'Chardonnay'], colors.Chardonnay,
            ['==', ['get', 'varietal'], 'Pinot Noir'], colors.PinotNoir,
            // Default color
            'aqua'
        ],
        fillOpacity: 1.0 // TODO: may vary opacity based on AOC level
    }));
    // Add a line layer for polygon borders
    map.layers.add(new atlas.layer.LineLayer(dataSource, "line-layer-" + featureSetName + '-' + aocLevel, {
        strokeColor: '#BBBBBB',
        strokeWidth: 1,
        minZoom: 12
    }));
}

function addLabelLayer(map: atlas.Map, dataSource: atlas.source.DataSource, featureSetName: string, aocLevel: string, labelSize: number) {
    // Add a layer for labels
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, "label-layer-" + featureSetName + aocLevel, {
        minZoom: 12,
        iconOptions: {
            image: ""
        },
        textOptions: {
            //no label if 'label' property is missing
            textField: ['get', 'label'],
            offset: [0, 0],
            color: 'gray',
            haloColor: 'white',
            haloWidth: 1,
            font: ['StandardCondensedSegoeUi-Bold'],
            size: labelSize,
            allowOverlap: false,
        }
    }));
}