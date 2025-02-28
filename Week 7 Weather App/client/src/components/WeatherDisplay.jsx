import PropTypes from 'prop-types';
import WeatherIcon from './WeatherIcon';

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, humidity },
    wind: { speed },
    weather,
  } = weatherData;

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
            <span className="label">Condition:</span> {weather[0].description}
          </p>
        </div>
      </div>
    </div>
  );
};

WeatherDisplay.propTypes = {
  weatherData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
    }).isRequired,
    wind: PropTypes.shape({
      speed: PropTypes.number.isRequired,
    }).isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
};

export default WeatherDisplay; 