/**
 * Weather Background Service
 * Handles fetching and caching weather-appropriate GIFs/videos
 */

// Cache for storing fetched GIF URLs by weather type
const backgroundCache = new Map();

// Default fallback images (can be replaced with actual URLs or local assets)
const FALLBACK_IMAGES = {
  thunder: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'heavy-rain': 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=1920&q=80',
  rain: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1920&q=80',
  wind: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920&q=80',
  sunny: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  cloud: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
  neutral: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
};

/**
 * Maps weather condition keys to Giphy search terms
 */
function getGiphySearchTerm(weatherKey) {
  const searchTerms = {
    thunder: 'thunderstorm lightning',
    'heavy-rain': 'heavy rain storm',
    rain: 'rain weather',
    wind: 'windy weather',
    sunny: 'sunny clear sky',
    cloud: 'cloudy sky',
    neutral: 'weather nature',
  };
  return searchTerms[weatherKey] || 'weather';
}

/**
 * Fetches a GIF from Giphy API based on weather condition
 * @param {string} weatherKey - The weather condition key (e.g., 'rain', 'sunny')
 * @param {string} giphyApiKey - Giphy API key (optional, reads from env if not provided)
 * @param {boolean} preferVideo - Whether to prefer video format (future enhancement)
 * @returns {Promise<string>} URL of the GIF/video
 */
export async function fetchWeatherGif(weatherKey, giphyApiKey = null, preferVideo = false) {
  // Check cache first
  if (backgroundCache.has(weatherKey)) {
    return backgroundCache.get(weatherKey);
  }

  // Get API key from parameter, env var, or use null (will use fallback)
  const apiKey = giphyApiKey || import.meta.env.VITE_GIPHY_API_KEY;
  
  // If no API key, use fallback immediately
  if (!apiKey) {
    console.info('No Giphy API key provided. Using fallback images.');
    const fallback = FALLBACK_IMAGES[weatherKey] || FALLBACK_IMAGES.neutral;
    backgroundCache.set(weatherKey, fallback);
    return fallback;
  }

  const searchTerm = getGiphySearchTerm(weatherKey);

  try {
    // Giphy API endpoint - use videos endpoint if preferVideo is true
    const endpoint = preferVideo ? 'videos/search' : 'gifs/search';
    const url = `https://api.giphy.com/v1/${endpoint}?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&limit=10&rating=g&lang=en`;

    const response = await fetch(url);
    
    if (!response.ok) {
      // If API fails, use fallback
      if (response.status === 401 || response.status === 403) {
        console.warn('Giphy API key invalid or rate limited. Using fallback images.');
      } else {
        console.warn(`Giphy API error: ${response.status}. Using fallback images.`);
      }
      const fallback = FALLBACK_IMAGES[weatherKey] || FALLBACK_IMAGES.neutral;
      backgroundCache.set(weatherKey, fallback);
      return fallback;
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      // Select a random result from the results for variety
      const randomIndex = Math.floor(Math.random() * data.data.length);
      let mediaUrl;
      
      if (preferVideo && data.data[randomIndex].images) {
        // Use video URL if available
        const videoData = data.data[randomIndex].images;
        mediaUrl = videoData.original_mp4?.mp4 || videoData.original?.url || data.data[randomIndex].images.original.url;
      } else {
        // Use GIF URL
        mediaUrl = data.data[randomIndex].images.original.url;
      }
      
      // Cache the result
      backgroundCache.set(weatherKey, mediaUrl);
      
      return mediaUrl;
    } else {
      // No results, use fallback
      const fallback = FALLBACK_IMAGES[weatherKey] || FALLBACK_IMAGES.neutral;
      backgroundCache.set(weatherKey, fallback);
      return fallback;
    }
  } catch (error) {
    console.warn('Failed to fetch media from Giphy:', error);
    // Return fallback image on error
    const fallback = FALLBACK_IMAGES[weatherKey] || FALLBACK_IMAGES.neutral;
    backgroundCache.set(weatherKey, fallback);
    return fallback;
  }
}

/**
 * Preloads background for a weather condition
 * @param {string} weatherKey - The weather condition key
 * @param {string} giphyApiKey - Optional Giphy API key
 * @param {boolean} preferVideo - Whether to prefer video format
 */
export async function preloadWeatherBackground(weatherKey, giphyApiKey = null, preferVideo = false) {
  if (!backgroundCache.has(weatherKey)) {
    await fetchWeatherGif(weatherKey, giphyApiKey, preferVideo);
  }
}

/**
 * Clears the background cache
 */
export function clearBackgroundCache() {
  backgroundCache.clear();
}

/**
 * Gets cached background URL if available
 * @param {string} weatherKey - The weather condition key
 * @returns {string|null} Cached URL or null
 */
export function getCachedBackground(weatherKey) {
  return backgroundCache.get(weatherKey) || null;
}
