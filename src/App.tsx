
import { useState, useEffect, type FC } from 'react';
import './App.css'
import AzureMap, { type Marker } from './components/AzureMap'

const App: FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [myMarkers, setMyMarkers] = useState<Marker[]>([]);


  // Dynamically load vineyard data
  useEffect(() => {
    const loadVineyards = async () => {
      try {
        const famousWines = await import('./data/famous-wines.json'); // Dynamically import JSON
        const myWines = await import('./data/my-wines.json'); // Dynamically import JSON
        setMarkers(famousWines.default); // Set markers from imported data
        setMyMarkers(myWines.default); // Set my markers from imported data
      } catch (error) {
        console.error('Error loading vineyard data:', error);
      }
    };

    loadVineyards();
  }, []);

  if (markers.length === 0) {
    return <div>Loading map...</div>;
  }

  return (
    <>
      <AzureMap markers={markers} myMarkers={myMarkers} />
    </>
  )
}

export default App
