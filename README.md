# FarmSync - Weather Module

A React + Vite application featuring dynamic weather backgrounds and ambient sound generation based on real-time weather conditions.

## Features

- **Real-time Weather Data**: Fetches current weather from OpenWeatherMap API
- **Dynamic Weather Backgrounds**: Automatically displays weather-appropriate GIFs/videos as backgrounds
- **Ambient Sound Generation**: Web Audio API generates ambient sounds matching weather conditions
- **Location Selection**: Choose from multiple locations across Malaysia, Singapore, and Thailand
- **Caching**: Weather backgrounds are cached to minimize API calls and improve performance
- **Fallback Support**: Gracefully falls back to static images if API calls fail or no API key is provided

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OpenWeatherMap API Key (Required)
# Get your free API key at: https://openweathermap.org/api
VITE_OWM_API_KEY=your_openweathermap_api_key_here

# Giphy API Key (Optional - for dynamic weather backgrounds)
# Get your free API key at: https://developers.giphy.com/
# If not provided, the app will use fallback static images
VITE_GIPHY_API_KEY=your_giphy_api_key_here
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Weather Background Feature

The app dynamically fetches and displays GIFs or videos that match the current weather conditions:

- **Thunderstorm**: Lightning and storm visuals
- **Rain/Heavy Rain**: Rainy weather scenes
- **Wind**: Windy conditions
- **Sunny**: Clear, sunny skies
- **Cloudy**: Cloudy weather
- **Neutral**: Default weather scenes

### Background Options

- **Toggle Dynamic Background**: Enable/disable dynamic backgrounds (falls back to CSS gradients)
- **Prefer Video**: Option to prefer video formats over GIFs (when available)
- **Automatic Caching**: Backgrounds are cached per weather type to reduce API calls
- **Fallback Images**: Uses Unsplash images if Giphy API is unavailable

## Project Structure

```
src/
├── components/
│   └── WeatherBackground.jsx    # Dynamic background component
├── services/
│   └── weatherBackground.js     # Background fetching and caching service
├── App.jsx                       # Main application component
└── index.css                     # Global styles and CSS animations
```

## Technologies

- React 19
- Vite
- OpenWeatherMap API
- Giphy API (optional)
- Web Audio API (for ambient sounds)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
