
import { useEffect, useState, type FC } from 'react';
import './App.css';
import AzureMap, { type Marker } from './components/AzureMap';
import SearchBar from './components/SearchBar';

const App: FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [regions, setRegions] = useState<any>([]);

  // Dynamically load vineyard data
  useEffect(() => {
    const loadData = async () => {
      try {
        const myWines = await import('./assets/data/my-wines.json'); // Dynamically import JSON
        setMarkers(myWines.default);

        const regions = [];
        regions.push(await import('./assets/data/bourgogne.json'));
        regions.push(await import('./assets/data/chalonnaise.json'));
        regions.push(await import('./assets/data/chablis.json'));
        setRegions(regions);
      } catch (error) {
        console.error('Error loading vineyard data:', error);
      }
    };

    loadData();
  }, []);

  if (regions.length === 0) {
    return <div>Loading map data...</div>;
  }

  return (
    <>
      <SearchBar />
      <AzureMap markers={markers} regions={regions} />
      <div className="attribution">
        AOC © INAO/IGN,
        <a href="https://www.data.gouv.fr/datasets/delimitation-parcellaire-des-aoc-viticoles-de-linao/" target="_blank">data.gouv.fr</a>,
        Etalab v2.0
      </div>
    </>
  )
}

export default App
