import { useState } from "react"
import { villageVarietalColors, vinsBlancs, vinsRouges } from "../types/legendColors"
import { CircleX, Layers } from "lucide-react"

const LegendRow = ({ label, color, hatchColor }: { label: string; color?: string; hatchColor?: string }) => (
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
            <defs>
                {hatchColor && (
                    <pattern
                        id={`diagonalHatch-${hatchColor}`}
                        patternUnits="userSpaceOnUse"
                        width="6"
                        height="6"
                        patternTransform="rotate(45)"
                    >
                        <line x1="0" y1="0" x2="0" y2="6" stroke={hatchColor} strokeWidth="2" />
                    </pattern>
                )}
            </defs>
            {/* Solid rectangle with the base color */}
            {color && (
                <rect
                    x="2"
                    y="2"
                    width="27"
                    height="20"
                    fill={color}
                    strokeWidth="3"
                    stroke="#BBBBBB"
                />
            )}
            {/* Hatch pattern overlay */}
            {hatchColor && (
                <rect
                    x="2"
                    y="2"
                    width="27"
                    height="20"
                    fill={`url(#diagonalHatch-${hatchColor})`}
                    strokeWidth="3"
                    stroke="#BBBBBB"
                />
            )}
        </svg>
    </div>
)

export const MapLegend: React.FC = () => {
    const [isLegendVisible, setIsLegendVisible] = useState(false)

    const toggleLegend = () => {
        setIsLegendVisible(!isLegendVisible)
    }

    return (
        <div className="absolute bottom-2 left-2 z-50">
            {/* Toggle Button */}
            {!isLegendVisible &&
                <button
                    onClick={toggleLegend}
                    className="bg-white p-2 rounded-lg shadow-md focus:outline-none"
                >
                    <Layers className="w-5 h-5 text-gray-500" />
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
                            <CircleX className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="flex space-x-3">
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
                        {/* Mixed Column */}
                        <div>
                            <div className="py-1 text-sm text-gray-700">Mixed/Other</div>
                            <LegendRow label="Premier Cru" color={vinsBlancs.PremierCru} hatchColor={vinsRouges.MixedPremierCru} />
                            <LegendRow label="Village" color={vinsBlancs.Village} hatchColor={vinsRouges.MixedVillage} />
                            <LegendRow label="Village Aligote" color={villageVarietalColors.Aligote} />
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}