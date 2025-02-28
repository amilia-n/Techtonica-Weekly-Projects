import { useState } from 'react'
import WeatherForm from './components/WeatherForm'
import WeatherDisplay from './components/WeatherDisplay'
import RainyBackground from './components/RainyBackground'
import DynamicFavicon from './components/DynamicFavicon'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCitySubmit = async (city) => {
    setLoading(true)
    setError(null)

    if (!city.trim()) {
      setError('Please enter a city name')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:9000/weather/${city}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setError('City not found. Please check the spelling and try again.')
        } else {
          setError(data.error || 'Failed to fetch weather data')
        }
        setWeatherData(null)
      } else {
        setWeatherData(data)
      }
    } catch {
      setError('Unable to fetch weather data. Please try again.')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  // fetch weather code for the favicon
  const weatherCode = weatherData?.weather?.[0]?.id;

  return (
    <>
      {/* DynamicFavicon component */}
      {weatherCode && <DynamicFavicon weatherCode={weatherCode} />}
      
      <div className="app">
        <header>
          <RainyBackground />
          <h1 id="ami">Ami's</h1>
          <div id="name">
            <span>Weather</span>
            <span>App</span>
          </div>
        </header>
        <main>
          <WeatherForm onCitySubmit={handleCitySubmit} />
          {loading && <p className="loading">Loading weather data...</p>}
          {error && <p className="error">{error}</p>}
          {weatherData && <WeatherDisplay weatherData={weatherData} />}
        </main>
      </div>
    </>
  )
}

export default App
