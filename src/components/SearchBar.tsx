import { useState } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import events from '../components/events';
import { items } from './items';

const SearchBar = () => {
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