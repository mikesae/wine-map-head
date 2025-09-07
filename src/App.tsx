
import { useState, useEffect, type FC } from 'react';
import './App.css'
import AzureMap, { type Marker } from './components/AzureMap'

const App: FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);

  // Dynamically load vineyard data
  useEffect(() => {
    const loadVineyards = async () => {
      try {
        const data = await import('./data/vineyards.json'); // Dynamically import JSON
        setMarkers(data.default); // Set markers from imported data
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
      <AzureMap markers={markers} />
    </>
  )
}

export default App
