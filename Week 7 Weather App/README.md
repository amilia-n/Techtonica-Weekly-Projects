# Weather Application

A full-stack weather application with a React frontend and Node.js backend.

## Features
- Real-time weather data
- Location-based weather information
- Weather forecasts
- Interactive UI
- Backend API integration

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Weather API key (from your chosen weather service)

## Installation

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file and add necessary environment variables

4. Start the client:
   ```bash
   npm start
   # or
   yarn start
   ```

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   - Create a `.env` file
   - Add your Weather API key
   - Add other necessary environment variables

4. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Usage
- Access the application at `http://localhost:3000`
- Enter a location to get weather information
- View current weather conditions
- Check weather forecasts
- Toggle between different weather views

## Development
Built using:
- React (Frontend)
- Node.js (Backend)
- Express.js
- Weather API integration
- Environment variables for secure configuration

## API Integration
- Weather data is fetched from a third-party weather service
- API key required for weather data access
- Backend proxies requests to weather service
- Rate limiting and error handling implemented 