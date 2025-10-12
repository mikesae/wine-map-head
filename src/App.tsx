
import { useState, useEffect, type FC } from 'react';
import './App.css'
import AzureMap, { type Marker } from './components/AzureMap'
import SearchBar from './components/SearchBar';

const App: FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [myMarkers, setMyMarkers] = useState<Marker[]>([]);
  const [aocs, setAocs] = useState<any>([]);


  // Dynamically load vineyard data
  useEffect(() => {
    const loadData = async () => {
      try {
        const famousWines = await import('./data/famous-wines.json'); // Dynamically import JSON
        const myWines = await import('./data/my-wines.json'); // Dynamically import JSON
        const aocs = await import('./data/bourgogne.json'); // Dynamically import JSON
        setMarkers(famousWines.default); // Set markers from imported data
        setMyMarkers(myWines.default); // Set my markers from imported data
        setAocs(aocs); // Set AOCs data from imported data if it exists
      } catch (error) {
        console.error('Error loading vineyard data:', error);
      }
    };

    loadData();
  }, []);

  if (markers.length === 0) {
    return <div>Loading map...</div>;
  }

  return (
    <>
      <SearchBar />
      <AzureMap markers={markers} myMarkers={myMarkers} regions={[aocs]} />
      <div className="attribution">
        AOC © INAO/IGN, <a href="https://www.data.gouv.fr/datasets/delimitation-parcellaire-des-aoc-viticoles-de-linao/" target="_blank">data.gouv.fr</a>, Etalab v2.0
      </div>
    </>
  )
}

export default App
