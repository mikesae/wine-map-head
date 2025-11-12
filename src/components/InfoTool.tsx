import React from "react";

interface InfoToolProps {
    appellation: string;
    climat: string;
    aocLevel: string;
}

const InfoTool: React.FC<InfoToolProps> = ({ appellation, climat, aocLevel }) => {
    return (
        <div className="p-4 text-black flex flex-col items-start">
            <h3>{appellation}</h3>
            <h3>{climat}</h3>
            <h3>{aocLevel}</h3>
        </div>
    );
};

export default InfoTool;