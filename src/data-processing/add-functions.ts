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

export function addPolygonLayer(map: atlas.Map, featureSet: any) {
    const dataSource = new atlas.source.DataSource(featureSet.name);
    map.sources.add(dataSource);

    // Add polygons to the data source
    featureSet.features.forEach((feature: any) => {
        if (feature.geometry.type === "MultiPolygon") {
            const coordinates = feature.geometry.coordinates;
            const multiPolygon = new atlas.data.MultiPolygon(coordinates);
            const atlasFeature = new atlas.data.Feature(multiPolygon, {
                aoc_level: feature.properties.aoc_level,
                appellation: feature.properties.appellation,
                climat: feature.properties.climat,
                varietal: feature.properties.varietal,
                label: feature.properties.label
            });
            dataSource.add(new atlas.Shape(atlasFeature));
        }
    });

    // Add a polygon layer
    map.layers.add(new atlas.layer.PolygonLayer(dataSource, "layer-" + featureSet.name, {
        fillColor: [
            'case',
            ['all', ['==', ['get', 'aoc_level'], 'Grand Cru'], ['==', ['get', 'varietal'], 'Chardonnay']], vinsBlancs.GrandCru,
            ['all', ['==', ['get', 'aoc_level'], 'Premier Cru'], ['==', ['get', 'varietal'], 'Chardonnay']], vinsBlancs.PremierCru,
            ['all', ['==', ['get', 'aoc_level'], 'Village'], ['==', ['get', 'varietal'], 'Chardonnay']], vinsBlancs.Village,
            ['all', ['==', ['get', 'aoc_level'], 'Grand Cru'], ['==', ['get', 'varietal'], 'Pinot Noir']], vinsRouges.GrandCru,
            ['all', ['==', ['get', 'aoc_level'], 'Premier Cru'], ['==', ['get', 'varietal'], 'Pinot Noir']], vinsRouges.PremierCru,
            ['all', ['==', ['get', 'aoc_level'], 'Village'], ['==', ['get', 'varietal'], 'Pinot Noir']], vinsRouges.Village,
            ['all', ['==', ['get', 'aoc_level'], 'Village'], ['==', ['get', 'varietal'], 'Mixed']], mixedColor,
            // Default color
            'aqua'
        ],
        fillOpacity: [
            'case',
            ['==', ['get', 'aoc_level'], 'Grand Cru'], fillOpacity.GrandCru,
            ['==', ['get', 'aoc_level'], 'Premier Cru'], fillOpacity.PremierCru,
            ['==', ['get', 'aoc_level'], 'Village'], fillOpacity.Village,
            // Default opacity
            0.5
        ]
    }));
    // Add a line layer for polygon borders
    map.layers.add(new atlas.layer.LineLayer(dataSource, "line-layer-" + featureSet.name, {
        strokeColor: '#BBBBBB',
        strokeWidth: 1,
        minZoom: 12
    }));
    // Add a layer for labels
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, "label-layer-" + featureSet.name, {
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
            size: 10,
            allowOverlap: false,
        }
    }));
}