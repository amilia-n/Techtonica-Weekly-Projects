import { useEffect } from 'react';
import thunderstormIcon from '../assets/icons/thunderstorm.png';
import rainIcon from '../assets/icons/rain.png';
import snowIcon from '../assets/icons/snow.png';
import atmosphereIcon from '../assets/icons/atmosphere.png';
import sunnyIcon from '../assets/icons/sunny.png';
import cloudyIcon from '../assets/icons/cloudy.png';

const DynamicFavicon = ({ weatherCode }) => {
  useEffect(() => {
    if (!weatherCode) return;
    
    let faviconUrl;
    
    // weather codes by category
    if (weatherCode >= 200 && weatherCode < 300) {
      // Thunder
      faviconUrl = thunderstormIcon;
    } else if ((weatherCode >= 300 && weatherCode < 400) || 
               (weatherCode >= 500 && weatherCode < 600)) {
      // Rainy
      faviconUrl = rainIcon;
    } else if (weatherCode >= 600 && weatherCode < 700) {
      // Snowing
      faviconUrl = snowIcon;
    } else if (weatherCode >= 700 && weatherCode < 800) {
      // Atmosphere
      faviconUrl = atmosphereIcon;
    } else if (weatherCode === 800) {
      // Sunny
      faviconUrl = sunnyIcon;
    } else if (weatherCode > 800 && weatherCode < 900) {
      // Cloudy
      faviconUrl = cloudyIcon;
    }
    
    if (faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'shortcut icon';
      link.href = faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    
      document.title = `Weather: ${getWeatherTitle(weatherCode)}`;
    }
  }, [weatherCode]);
  
  const getWeatherTitle = (code) => {
    if (code >= 200 && code < 300) return 'Thunderstorm';
    if (code >= 300 && code < 400) return 'Drizzle';
    if (code >= 500 && code < 600) return 'Rain';
    if (code >= 600 && code < 700) return 'Snow';
    if (code >= 700 && code < 800) return 'Atmosphere';
    if (code === 800) return 'Clear Sky';
    if (code > 800 && code < 900) return 'Cloudy';
    return 'Weather App';
  };

  return null;
};

export default DynamicFavicon; 