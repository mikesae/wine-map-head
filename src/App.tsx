
import { useEffect, useState, type FC } from 'react';
import './App.css';
import AzureMap from './components/AzureMap';
import SearchBar from './components/SearchBar';
import type { Marker } from './types/mapping';
import { MapLegend } from './components/MapLegend';
import { Version } from './components/Version';
import { MapSettings } from './components/MapSettings';

const App: FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [regions, setRegions] = useState<any>([]);
  const [places, setPlaces] = useState<Marker[]>([]);

  // Dynamically load vineyard data
  useEffect(() => {
    const loadData = async () => {
      try {
        const myWines = await import('./assets/data/my-wines.json'); // Dynamically import JSON
        setMarkers(myWines.default);

        const myPlaces = await import('./assets/data/places.json');
        setPlaces(myPlaces.default);

        const regions = [];
        regions.push(await import('./assets/data/cote-d-or-enriched.json'));
        regions.push(await import('./assets/data/chalonnaise-enriched.json'));
        regions.push(await import('./assets/data/chablis-enriched.json'));
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
      <SearchBar places={places} />
      <MapSettings />
      <MapLegend />
      <AzureMap markers={markers} regions={regions} places={places} />
      <div className="attribution text-sm">
        <span className="hidden sm:inline">
          AOC © INAO/IGN,
        </span>
        <a href="https://www.data.gouv.fr/datasets/delimitation-parcellaire-des-aoc-viticoles-de-linao/" target="_blank">
          data.gouv.fr
        </a>,
        <span className="hidden sm:inline">
          Etalab v2.0
        </span>
      </div>
    </>
  )
}

export default App
