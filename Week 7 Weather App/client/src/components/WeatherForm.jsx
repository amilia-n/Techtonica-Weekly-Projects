import { useState } from 'react';
import PropTypes from 'prop-types';

const WeatherForm = ({ onCitySubmit }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onCitySubmit(city.trim());
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="weather-form">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        className="city-input"
        required
      />
      <button type="submit" className="submit-button">
        Get Weather
      </button>
    </form>
  );
};

WeatherForm.propTypes = {
  onCitySubmit: PropTypes.func.isRequired,
};

export default WeatherForm; 