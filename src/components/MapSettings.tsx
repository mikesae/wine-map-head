import { CircleX, Settings } from "lucide-react"
import { useState } from "react"
import { Version } from "./Version"
import events from "./events"
import { useMapStore } from "../hooks/useMapStore"

export const MapSettings: React.FC = () => {
    const [isMapSettingsVisible, setIsMapSettingsVisible] = useState(false)
    const [layerOpacity, setLayerOpacity] = useState(useMapStore.getState().layerOpacity)
    const [showPlaceNames, setShowPlaceNames] = useState(useMapStore.getState().showPlaceNames);

    const toggleMapSettings = () => {
        setIsMapSettingsVisible(!isMapSettingsVisible)
    }

    return (
        <div className="absolute top-40 right-3 z-50">
            {/* Toggle Button */}
            {!isMapSettingsVisible &&
                <button
                    onClick={toggleMapSettings}
                    className="bg-white text-gray-800 px-1 py-1 rounded-lg shadow-md focus:outline-none"
                >
                    <Settings className="w-5 h-5 text-gray-500" />
                </button>
            }

            {/* MapSettings */}
            {isMapSettingsVisible && (
                <div className="bg-white text-gray-800 mt-2 w-auto p-2 text-left border-gray-500 rounded-lg drop-shadow-lg">
                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={toggleMapSettings}
                            className="text-gray-500 hover:text-gray-800 focus:outline-none"
                        >
                            <CircleX className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mb-2 mt-2 text-xs">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={layerOpacity}
                            className="w-full appearance-none bg-gray-400 text-gray-800 h-2 rounded-lg outline-none"
                            onChange={(e) => {
                                const opacityValue = e.target.value;
                                setLayerOpacity(parseInt(opacityValue, 10));
                                events.emit('setLayerOpacity', parseInt(opacityValue, 10));
                            }}
                        />
                        Opacity:&nbsp;
                        <span id="opacity-value" className="text-gray-600">{layerOpacity}</span>
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="show-place-names"
                                checked={showPlaceNames}
                                className="mr-2 appearance-none h-4 w-4 border border-gray-400 rounded-sm checked:border-gray-600 checked:bg-white checked:before:content-['✔'] checked:before:block checked:before:text-center focus:outline-none"
                                onChange={(e) => {
                                    const showPlaceNames = e.target.checked;
                                    setShowPlaceNames(showPlaceNames);
                                    events.emit('togglePlaceNames', showPlaceNames);
                                }}
                            />
                            <label htmlFor="show-place-names">Show Place Names</label>
                        </div>

                    </div>
                    <div className="flex space-x-3">
                        <Version />
                    </div>
                </div>
            )}
        </div>
    )
}