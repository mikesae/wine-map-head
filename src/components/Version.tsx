
export const Version: React.FC = () => {
    return (
        <div className="absolute bottom-0 left-16 z-50 text-gray-800 text-xs backdrop-brightness-90 text-left">
            <p>App Version: {__APP_VERSION__} </p>
            <p> Build Date: {__BUILD_DATE__} </p>
        </div>
    )
}