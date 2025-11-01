import React from "react"
import { vinsBlancs, vinsRouges } from "../types/legendColors"

export const MapLegend: React.FC = () => {
    return (
        <div className="bg-white text-black absolute bottom-2 left-2 z-50 w-auto p-4 text-left border-gray-500 rounded-lg">
            <div className="py-1">Vin Rouge</div>
            <div className="flex justify-between items-center py-1">
                <span className="ml-3 mr-10 text-sm">Grand Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsRouges.GrandCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center py-1">
                <span className="ml-3 mr-10 text-sm">Premier Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsRouges.PremierCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center py-1">
                <span className="ml-3 mr-10 text-sm">Village</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsRouges.Village} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="pt-2 pb-1">Vin Blanc</div>
            <div className="flex justify-between items-center py-1">
                <span className="ml-3 mr-10 text-sm">Grand Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsBlancs.GrandCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center py-1">
                <span className="ml-3 mr-10 text-sm">Premier Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsBlancs.PremierCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center py-1">
                <span className="ml-3 mr-10 text-sm">Village</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsBlancs.Village} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
        </div>
    )
}