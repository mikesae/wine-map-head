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