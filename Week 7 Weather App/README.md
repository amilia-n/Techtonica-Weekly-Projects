# Ami's Weather App 🌤️

A beautiful and responsive weather application built with React that displays current weather conditions with a charming animated rainy background.

## Features ✨

- Real-time weather data from OpenWeatherMap API
- Animated rain effect with interactive umbrella
- Responsive design that works on desktop and mobile
- Clean and intuitive user interface
- Dynamic weather icons based on current conditions
- Display of temperature, humidity, wind speed, and weather conditions

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation 🚀

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   ```

2. Navigate to the project directory:
   ```bash
   cd weather-app
   ```

3. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

4. Create a `.env` file in the server directory:
   ```bash
   cd server
   touch .env
   ```

5. Add your OpenWeatherMap API key to the `.env` file:
   ```
   API_KEY=your_api_key_here
   ```

## Running the Application 🏃‍♀️

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## How to Use 📱

1. When the app loads, you'll see a beautiful interface with an animated rainy background and an interactive umbrella.

2. Enter a city name in the search bar and click the "Search" button or press Enter.

3. The app will display:
   - City name
   - Current temperature in Celsius
   - Humidity percentage
   - Wind speed in meters per second
   - Weather condition with a corresponding icon

4. The umbrella in the background is interactive - try clicking it!

## Technologies Used 💻

- Frontend:
  - React
  - Vite
  - CSS3 Animations
  - OpenWeatherMap API Integration

- Backend:
  - Node.js
  - Express
  - CORS
  - dotenv

## Troubleshooting 🔧

- If you see a "Failed to fetch weather data" error, check that:
  - Your API key is correctly set in the `.env` file
  - The server is running on port 9000
  - The city name is spelled correctly

- If the animations aren't smooth:
  - Check that your browser is up to date
  - Ensure hardware acceleration is enabled in your browser

## Contributing 🤝

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Weather data provided by OpenWeatherMap
- Icons from OpenWeatherMap's weather icon set
- Built with React and Vite 