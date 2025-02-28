import PropTypes from 'prop-types';

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

WeatherIcon.propTypes = {
  iconCode: PropTypes.string.isRequired,
};

export default WeatherIcon; 