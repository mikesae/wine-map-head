import type atlas from "azure-maps-control";
import type { MapMouseEvent } from "azure-maps-control";
import { Clipboard } from "lucide-react";
import React from "react";
import type { InfoToolProps } from "../types/mapping";

const createMapUrl = (event: MapMouseEvent): string => {
    const map: atlas.Map = event.map;
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const pixel = event.pixel || [0, 0];
    const latLong = map.pixelsToPositions([pixel]);
    const zoom = map.getCamera().zoom ?? 0
    const bearing = map.getCamera().bearing ?? 0;

    const params = new URLSearchParams({
        lat: latLong[0][1].toString(),
        lng: latLong[0][0].toString(),
        zoom: zoom.toString(),
        bearing: bearing.toString(),
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

const InfoTool: React.FC<InfoToolProps> = ({ shape, event }) => {
    const url = createMapUrl(event);

    const props = shape.getProperties();
    //const layerId = shape.dataSource.id;
    const appellation = props && props.hasOwnProperty('appellation') ? props['appellation'] : null;
    const aocLevel = props && props.hasOwnProperty('aoc_level') ? props['aoc_level'] : null;
    const climat = props && props.hasOwnProperty('climat') ? props['climat'] : null;
    const name = props && props.hasOwnProperty('name') ? props['name'] : null;
    const vintage = props && props.hasOwnProperty('vintage') ? props['vintage'] : null;

    return (
        <div className="p-4 text-black flex flex-col items-start">
            {name && <h3>{name}</h3>}
            {vintage && <h3>{vintage}</h3>}
            {appellation && <h3>{appellation}</h3>}
            {climat && <h3>{climat}</h3>}
            {aocLevel && <h3>{aocLevel}</h3>}
            <a
                href={url}
                onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(url);
                }}
                className="mt-2 text-sm text-blue-500 underline hover:text-blue-600"
            >
                <Clipboard className="w-4 h-4 mr-1" />
            </a>
        </div>
    );
};

export default InfoTool;