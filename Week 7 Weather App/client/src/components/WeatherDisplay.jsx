import WeatherIcon from './WeatherIcon';

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    name,
    sys: { country },
    main: { temp, humidity },
    wind: { speed },
    weather,
  } = weatherData;

  // func to capitalize first letter of each word
  const capitalizeWords = (text) => {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Celsius to Fahrenheit
  const toFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  // full country name from country code
  const getCountryName = (countryCode) => {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(countryCode);
    } catch {
      return countryCode; 
    }
  };

  const tempCelsius = Math.round(temp);
  const tempFahrenheit = Math.round(toFahrenheit(temp));
  const countryName = getCountryName(country);

  return (
    <div className="weather-display">
      <h2>{name}, {countryName}</h2>
      <div className="weather-info">
        <WeatherIcon iconCode={weather[0].icon} />
        <div className="weather-details">
          <p className="temperature">
            <span className="label">Temperature:</span> {tempFahrenheit}°F / {tempCelsius}°C
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