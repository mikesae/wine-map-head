import { useState } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import events from '../components/events';
import type { Marker } from '../types/mapping';

interface SearchBarProps {
    places: Marker[];
}

const SearchBar: React.FC<SearchBarProps> = ({ places }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const toggleSearchBar = () => {
        setIsSearchVisible((prev) => !prev)
    }

    const items = places.map((place, index) => ({
        id: index,
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude
    }))

    const onSelect = (item: any) => {
        console.log(item);
        events.emit('recenter', { lat: item.latitude, lng: item.longitude });
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
                        boxShadow: 'rgba(0, 0, 0, .16) 0 0 4px',
                        cursor: 'pointer',
                        padding: '5px 6px'
                    }}
                >
                    <svg className="search-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                            fill='#83888e'
                            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>
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
                        width: 330,
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
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                hoverBackgroundColor: '#f2f2f2',
                                color: '#333',
                                fontSize: '16px',
                                fontFamily: 'Arial',
                                iconColor: '#83888e',
                                lineColor: '#ddd',
                                placeholderColor: '#aaa',
                            }}
                        />
                    </div>
                    <button
                        onClick={toggleSearchBar}
                        style={{
                            height: '32px',
                            background: 'white',
                            border: 'none',
                            color: '#83888e',
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