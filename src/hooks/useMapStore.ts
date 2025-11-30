import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MapSettings {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
    layerOpacity: number;
    showPlaceNames: boolean;
    setMapSettings: (settings: Partial<MapSettings>) => void;
}

export const useMapStore = create<MapSettings>()(
    persist(
        (set) => ({
            center: [4.947624206669559, 47.14046061394379,], // Default center
            zoom: 12, // Default zoom
            pitch: 0,
            bearing: 290,
            layerOpacity: 100, // Default layer opacity
            showPlaceNames: false,
            setMapSettings: (settings) =>
                set((state) => ({
                    ...state,
                    ...settings
                }))
        }),
        {
            name: 'map-settings', // Key for localStorage
            storage: createJSONStorage(() => localStorage) // Use localStorage to persist state
        }
    )
);