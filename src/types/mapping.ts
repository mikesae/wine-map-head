export interface Marker {
    name: string;
    latitude: number;
    longitude: number;
    region?: string;
    label?: string;
}

export interface AzureMapProps {
    markers: Marker[];
    regions: any[];
    places: Marker[];
}

export interface Vineyard {
    appellation: string;
    climat: string;
    aocLevel: string;
}

export interface MapViewState {
    latitude: number;
    longitude: number;
    zoom: number;
    bearing: number;
}