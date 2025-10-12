import { useState } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import events from '../components/events';

const SearchBar = () => {
    const items = [
        { id: 1, name: 'Aloxe-Corton', lat: 47.046, lng: 4.883 },
        { id: 2, name: 'Beaune', lat: 47.026, lng: 4.84 },
        { id: 3, name: 'Bouzeron', lat: 46.997, lng: 4.746 },
        { id: 4, name: 'Chambolle-Musigny', lat: 47.151, lng: 4.965 },
        { id: 5, name: 'Chassagne-Montrachet', lat: 46.992, lng: 4.724 },
        { id: 6, name: 'Côte Chalonnaise', lat: 46.85, lng: 4.7 },
        { id: 7, name: 'Côte de Beaune', lat: 47.0, lng: 4.8 },
        { id: 8, name: 'Côte de Nuits', lat: 47.1, lng: 4.9 },
        { id: 9, name: 'Fixin', lat: 47.151, lng: 4.965 },
        { id: 10, name: 'Gevrey-Chambertin', lat: 47.151, lng: 4.965 },
        { id: 11, name: 'Givry', lat: 46.85, lng: 4.7 },
        { id: 12, name: 'Maranges', lat: 46.85, lng: 4.7 },
        { id: 13, name: 'Marsannay', lat: 47.2, lng: 4.95 }, ,
        { id: 14, name: 'Meursault', lat: 46.99, lng: 4.78 },
        { id: 15, name: 'Mercurey', lat: 46.85, lng: 4.7 },
        { id: 16, name: 'Montagny', lat: 46.85, lng: 4.7 },
        { id: 17, name: 'Morey-Saint-Denis', lat: 47.151, lng: 4.965 },
        { id: 18, name: 'Mâcon', lat: 46.3, lng: 4.83 },
        { id: 19, name: 'Mâcon-Villages', lat: 46.3, lng: 4.83 },
        { id: 20, name: 'Mâconnais', lat: 46.3, lng: 4.83 },
        { id: 21, name: 'Nuits-Saint-Georges', },
        { id: 22, name: 'Pommard', lat: 47.026, lng: 4.84 },
        { id: 23, name: 'Pouilly-Fuissé', lat: 46.3, lng: 4.83 },
        { id: 24, name: 'Pouilly-Loché', lat: 46.3, lng: 4.83 },
        { id: 25, name: 'Pouilly-Vinzelles', lat: 46.3, lng: 4.83 },
        { id: 26, name: 'Puligny-Montrachet', lat: 46.99, lng: 4.78 },
        { id: 27, name: 'Rully', lat: 46.85, lng: 4.7 },
        { id: 28, name: 'Saint-Amour', lat: 46.3, lng: 4.83 },
        { id: 29, name: 'Saint-Véran', lat: 46.3, lng: 4.83 },
        { id: 30, name: 'Santenay', lat: 46.99, lng: 4.78 },
        { id: 31, name: 'Viré-Clessé', lat: 46.3, lng: 4.83 },
        { id: 32, name: 'Volnay', lat: 47.026, lng: 4.84 },
        { id: 33, name: 'Vosne-Romanée', lat: 47.151, lng: 4.965 },
        { id: 34, name: 'Vougeot', lat: 47.151, lng: 4.965 },
    ];

    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const toggleSearchBar = () => {
        setIsSearchVisible((prev) => !prev)
    }

    const onSelect = (item: any) => {
        console.log(item);
        events.emit('recenter', { lat: item.lat, lng: item.lng });
        toggleSearchBar();
    }

    return (
        <div style={{ position: 'relative', zIndex: 1000 }}>
            {!isSearchVisible && (
                <button
                    onClick={toggleSearchBar}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        top: '20px',
                        background: 'white',
                        border: '1px solid gray',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#333',
                    }}
                >   🔍
                </button>
            )}
            {isSearchVisible && (
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center', // Vertically align the button with the search bar
                        justifyContent: 'space-between', // Space out the search bar and button
                        width: 400,
                        margin: '0 auto',
                        padding: '20px',
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <ReactSearchAutocomplete
                            items={items}
                            onSelect={onSelect}
                            autoFocus
                            showClear={false} // we have our own clear button
                            styling={{
                                height: '40px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                hoverBackgroundColor: '#f2f2f2',
                                color: '#333',
                                fontSize: '16px',
                                fontFamily: 'Arial',
                                iconColor: '#333',
                                lineColor: '#ddd',
                                placeholderColor: '#aaa',
                            }}
                        />
                    </div>
                    <button
                        onClick={toggleSearchBar}
                        style={{
                            height: '40px',
                            background: 'white',
                            border: 'none',
                            color: '#333',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            marginLeft: '-30px', // Overlap with the search bar
                            zIndex: 1001,
                        }}
                    >X
                    </button>
                </div>
            )
            }
        </div >
    )
}

export default SearchBar