import { useState } from "react"
import { vinsBlancs, vinsRouges } from "../types/legendColors"
import { CircleX, Layers } from "lucide-react"

const LegendRow = ({ label, color }: { label: string; color: string }) => (
    <div className="flex justify-between items-center py-1">
        <span className="text-xs text-gray-700">{label}</span>
        <svg
            className="ml-auto"
            width="27"
            height="20"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 27 24"
        >
            <rect x="2" y="2" width="27" height="20" fill={color} strokeWidth="3" stroke="#BBBBBB" />
        </svg>
    </div>
)

export const MapLegend: React.FC = () => {
    const [isLegendVisible, setIsLegendVisible] = useState(false)

    const toggleLegend = () => {
        setIsLegendVisible(!isLegendVisible)
    }

    return (
        <div className="absolute bottom-0 left-0 z-50">
            {/* Toggle Button */}
            {!isLegendVisible &&
                <button
                    onClick={toggleLegend}
                    className="bg-white text-black px-4 py-2 rounded-lg shadow-md focus:outline-none"
                >
                    <Layers className="w-5 h-5 text-gray-800" />
                </button>
            }

            {/* Legend */}
            {isLegendVisible && (
                <div className="bg-white text-black mt-2 w-auto p-2 text-left border-gray-500 rounded-lg drop-shadow-lg">
                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={toggleLegend}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <CircleX className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex space-x-4">
                        {/* Vin Rouge Column */}
                        <div>
                            <div className="py-1 text-sm text-gray-700">Vin Rouge</div>
                            <LegendRow label="Grand Cru" color={vinsRouges.GrandCru} />
                            <LegendRow label="Premier Cru" color={vinsRouges.PremierCru} />
                            <LegendRow label="Village" color={vinsRouges.Village} />
                        </div>
                        {/* Vin Blanc Column */}
                        <div>
                            <div className="py-1 text-sm text-gray-700">Vin Blanc</div>
                            <LegendRow label="Grand Cru" color={vinsBlancs.GrandCru} />
                            <LegendRow label="Premier Cru" color={vinsBlancs.PremierCru} />
                            <LegendRow label="Village" color={vinsBlancs.Village} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}