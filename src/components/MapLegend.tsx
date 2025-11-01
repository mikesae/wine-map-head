import React from "react"
import { vinsBlancs, vinsRouges } from "../types/legendColors"

export const MapLegend: React.FC = () => {
    return (
        <div className="bg-white text-black absolute bottom-0 left-0 z-50 w-auto p-4 text-left border-gray-500 rounded-lg">
            <div>Vin Rouge</div>
            <div className="flex justify-between items-center">
                <span className="ml-5 mr-10">Grand Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsRouges.GrandCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center">
                <span className="ml-5 mr-10">Premier Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsRouges.PremierCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center">
                <span className="ml-5 mr-10">Village</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsRouges.Village} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div>Vin Blanc</div>
            <div className="flex justify-between items-center">
                <span className="ml-5 mr-10">Grand Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsBlancs.GrandCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center">
                <span className="ml-5 mr-10">Premier Cru</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsBlancs.PremierCru} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
            <div className="flex justify-between items-center">
                <span className="ml-5 mr-10">Village</span>
                <svg
                    className="ml-auto"
                    width="40"
                    height="20"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <rect x="2" y="2" width="40" height="20" fill={vinsBlancs.Village} strokeWidth="3" stroke="#BBBBBB" />
                </svg>
            </div>
        </div>
    )
}