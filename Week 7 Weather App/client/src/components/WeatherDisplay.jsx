import WeatherIcon from './WeatherIcon';

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, humidity },
    wind: { speed },
    weather,
  } = weatherData;

// func to capitalize first letter of each word
  const capitalizeWords = (text) => {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="weather-display">
      <h2>{name}</h2>
      <div className="weather-info">
        <WeatherIcon iconCode={weather[0].icon} />
        <div className="weather-details">
          <p className="temperature">
            <span className="label">Temperature:</span> {Math.round(temp)}°C
          </p>
          <p className="humidity">
            <span className="label">Humidity:</span> {humidity}%
          </p>
          <p className="wind">
            <span className="label">Wind Speed:</span> {speed} m/s
          </p>
          <p className="description">
            <span className="label">Condition:</span> {capitalizeWords(weather[0].description)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay; 