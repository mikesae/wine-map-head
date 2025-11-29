
export const Version: React.FC = () => {
    return (
        <div className="text-gray-800 text-xs text-left">
            <p>Version: {__APP_VERSION__} </p>
            <p>Build Date: {__BUILD_DATE__} </p>
        </div>
    )
}