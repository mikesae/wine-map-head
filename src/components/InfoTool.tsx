import React from "react";
import type { MapViewState, Vineyard } from "../types/mapping";
import { Clipboard } from "lucide-react";

interface InfoToolProps {
    mapState: MapViewState;
    vineyard: Vineyard;
}

const createMapUrl = (mapState: MapViewState): string => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams({
        lat: mapState.latitude.toString(),
        lng: mapState.longitude.toString(),
        zoom: mapState.zoom.toString(),
        bearing: mapState.bearing.toString(),
    });

    return `${baseUrl}?${params.toString()}`;
};

const copyToClipboard = async (url: string) => {
    try {
        await navigator.clipboard.writeText(url);
    } catch (err) {
        console.error("Failed to copy URL: ", err);
    }
};

const InfoTool: React.FC<InfoToolProps> = ({ mapState, vineyard }) => {
    const url = createMapUrl(mapState);

    return (
        <div className="p-4 text-black flex flex-col items-start">
            <h3>{vineyard.appellation}</h3>
            <h3>{vineyard.climat}</h3>
            <h3>{vineyard.aocLevel}</h3>
            <a
                href={url}
                onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    copyToClipboard(url); // Copy URL to clipboard
                }}
                className="mt-2 text-sm text-blue-500 underline hover:text-blue-600"
            >
                <Clipboard className="w-4 h-4 mr-1" />
            </a>
        </div>
    );
};

export default InfoTool;