import { useState } from 'react'
import WeatherForm from './components/WeatherForm'
import WeatherDisplay from './components/WeatherDisplay'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCitySubmit = async (city) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:9000/weather/${city}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch weather data')
      }
      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError(err.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Weather App</h1>
      </header>
      <main>
        <WeatherForm onCitySubmit={handleCitySubmit} />
        {loading && <p className="loading">Loading weather data...</p>}
        {error && <p className="error">{error}</p>}
        {weatherData && <WeatherDisplay weatherData={weatherData} />}
      </main>
    </div>
  )
}

export default App
