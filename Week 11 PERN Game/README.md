# Gomoku Game

A full-stack web application featuring a Gomoku (Five in a Row) game with a leaderboard system. 
Built using the PERN stack (PostgreSQL, Express, React, Node.js).

## Features

- Interactive 15x15 Gomoku game board
- Turn-based gameplay with Black and White players
- 10-minute timer per player
- Win detection in all directions (horizontal, vertical, diagonal)
- Player leaderboard system
- Confetti animation on game win

## Tech Stack

### Frontend
- React.js
- CSS3
- Axios for API calls
- Canvas Confetti for animations

### Backend
- Node.js with Express
- PostgreSQL database
- Jest for testing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <https://github.com/amilia-n/Techtonica-Weekly-Projects.git>
cd Week 11 Pern Game
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up the database:
```bash
# Navigate to server directory
cd ../server

# Create database
createdb gomoku

# Run database migrations
psql -d gomoku -f db/schema.sql
```

4. Create a `.env` file in the server directory:
```env
PORT=5001
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=gomoku
DB_HOST=localhost
DB_PORT=5432
```

## Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the client:
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Testing

### Server Tests
```bash
cd server
npm test
```

### Client Tests
```bash
cd client
npm test
```

## Project Structure

```
gomoku-game/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Backend Node.js/Express application
│   ├── db/                # Database setup and queries
│   ├── __tests__/         # Server tests
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
```

## API Endpoints

### Players API
- `GET /api/players/leaderboard` - Get all players sorted by score
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player's score
- `DELETE /api/players/:id` - Delete a player

## Database Schema

### Players Table
```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


## Game Rules

1. The game is played on a 15x15 grid
2. Black plays first
3. Players take turns placing their stones
4. First player to get 5 stones in a row (horizontally, vertically, or diagonally) wins
5. Each player has 10 minutes to make their moves
6. If a player runs out of time, their opponent wins

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
