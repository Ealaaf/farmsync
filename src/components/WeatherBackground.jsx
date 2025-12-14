import { useEffect, useState, useRef } from 'react';
import { fetchWeatherGif, getCachedBackground } from '../services/weatherBackground';

/**
 * WeatherBackground Component
 * Displays dynamic GIF/video background based on weather conditions
 * 
 * @param {string} weatherKey - Weather condition key (e.g., 'rain', 'sunny')
 * @param {string} weatherDescription - Full weather description for alt text
 * @param {boolean} preferVideo - Whether to prefer videos over GIFs (future enhancement)
 * @param {string} giphyApiKey - Optional Giphy API key
 */
export default function WeatherBackground({ 
  weatherKey, 
  weatherDescription = '',
  preferVideo = false,
  giphyApiKey = null 
}) {
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!weatherKey) {
      setIsLoading(false);
      return;
    }

    // Check cache first for instant display
    const cached = getCachedBackground(weatherKey);
    if (cached) {
      setBackgroundUrl(cached);
      setIsLoading(false);
      return;
    }

    // Fetch new background
    setIsLoading(true);
    setError(null);

    fetchWeatherGif(weatherKey, giphyApiKey, preferVideo)
      .then((url) => {
        setBackgroundUrl(url);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading weather background:', err);
        setError(err);
        setIsLoading(false);
      });
  }, [weatherKey, giphyApiKey, preferVideo]);

  // Preload next image when URL changes for smooth transitions
  useEffect(() => {
    if (backgroundUrl && imgRef.current) {
      const img = new Image();
      img.src = backgroundUrl;
    }
  }, [backgroundUrl]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Background Media */}
      {backgroundUrl && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
          }}
        >
          {preferVideo && (backgroundUrl.includes('.mp4') || backgroundUrl.includes('/mp4')) ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out',
              }}
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setError(new Error('Failed to load background video'));
                setIsLoading(false);
              }}
            >
              <source src={backgroundUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              ref={imgRef}
              src={backgroundUrl}
              alt={`Weather background: ${weatherDescription || weatherKey}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out',
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError(new Error('Failed to load background image'));
                setIsLoading(false);
              }}
            />
          )}
        </div>
      )}

      {/* Loading indicator (optional, can be removed) */}
      {isLoading && !backgroundUrl && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #020617 0%, #0b1220 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
          }}
        />
      )}

      {/* Dark overlay for content readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(2,6,23,0.65) 0%, rgba(11,18,32,0.60) 50%, rgba(2,6,23,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Additional gradient overlay for better text contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(2,6,23,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
