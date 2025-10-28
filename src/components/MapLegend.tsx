import React from "react"
import { vinsBlancs, vinsRouges } from "../types/legendColors"

export const MapLegend: React.FC = () => {
    return (
        <div className="map-legend">
            <h4>Legend</h4>
            <div>Vins Rouge</div>
            <div>
                Grand Cru
                <svg className="legend-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg" fill={vinsRouges.GrandCru} viewBox="0 0 24 24" />
            </div>
            <div>
                Premier Cru
                <svg className="legend-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg" fill={vinsRouges.PremierCru} viewBox="0 0 24 24" />
            </div>
            <div>
                Village
                <svg className="legend-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg" fill={vinsRouges.Village} viewBox="0 0 24 24" />
            </div>
            <div>Vin Blanc</div>
            <div>
                Grand Cru
                <svg className="legend-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg" fill={vinsBlancs.GrandCru} viewBox="0 0 24 24" />
            </div>
            <div>
                Premier Cru
                <svg className="legend-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg" fill={vinsBlancs.PremierCru} viewBox="0 0 24 24" />
            </div>
            <div>
                Village
                <svg className="legend-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg" fill={vinsBlancs.Village} viewBox="0 0 24 24" />
            </div>
        </div>
    )
}