const WeatherIcon = ({ iconCode }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <img 
      src={iconUrl} 
      alt="Weather condition" 
      className="weather-icon"
      width="100"
      height="100"
    />
  );
};

export default WeatherIcon; 