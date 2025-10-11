# Wine Map Viewer

This project is a React application built with TypeScript and Vite. It provides an interactive map to visualize wine regions using Azure Maps. The application supports features like displaying polygons for wine regions, handling GeoJSON data, and dynamic styling of map layers.

## Features

- **Interactive Map**: Uses Azure Maps to display wine regions.
- **GeoJSON Support**: Loads and renders GeoJSON data for wine regions.
- **Dynamic Styling**: Allows customization of polygon colors and labels.
- **React + TypeScript**: Built with modern tools for scalability and maintainability.
- **Vite**: Fast development server with hot module replacement (HMR).

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type-safe development.
- **Vite**: For fast builds and development.
- **Azure Maps**: For map rendering and data visualization.

## Data Attribution

Wine appellation boundaries (AOC) © Institut national de l’origine et de la qualité (INAO)  
and Institut national de l'information géographique et forestière (IGN).  
Sourced from [data.gouv.fr](https://www.data.gouv.fr/datasets/delimitation-parcellaire-des-aoc-viticoles-de-linao/)  
Licensed under [Etalab Open Licence v2.0](https://www.etalab.gouv.fr/licence-ouverte-open-licence/).

Note: The data has been simplified and split into separate JSON files.

## Getting Started

### Prerequisites

- Node.js (v22.12 or higher)
- Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wine-map-viewer