# Valorant Match Tracker with AI Analysis

A full-stack web application that combines match tracking functionality with AI-powered analysis for Valorant matches. Built using modern web technologies and Google's Generative AI Gemini 2.0 Pro Experimental API.

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **AI Integration**: Gemini 2.0-exp
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Google Generative AI API Key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory with:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```

4. Set up the database:
   ```bash
   cd server
   psql -U postgres -d valorant_tracker -f db/db.sql
   ```

## Running the Application

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Start the client:
   ```bash
   cd client
   npm run dev
   ```

## Features

- Match data entry and storage
- AI-powered match analysis
- Historical match viewing
- Performance tracking
- Team statistics

## Sample Data

The database is initialized with sample match data to demonstrate the application's functionality:

- **4 sample matches** across different maps (Pearl, Ascent, Split, Icebox)
- **Various match outcomes** (Victory, Defeat, Tie)
- **Complete player statistics** for both teams including:
  - Agent selections
  - Rank information
  - Performance metrics (ACS, KDA, damage delta, etc.)
- **AI-generated analysis** for each match
- **User statistics** tracking the player's agent selection and match results

This sample data allows users to explore the application's features without needing to input their own match data first.

## Data Flow and Component Architecture

### Component Structure

1. **GenerateTable.jsx**
   - Primary component for match data entry
   - Handles data validation and formatting
   - Manages state for:
     - Table data (teamA and teamB)
     - Agent selection
     - Match information
     - Loading states
   - Key functions:
     - `handleSubmitTable`: Processes and submits match data
     - `handleCellEdit`: Manages cell-level edits
     - `handleAgentSelect`: Handles agent selection with autocomplete

2. **ListAll.jsx**
   - Displays all saved matches
   - Manages state for:
     - Saved matches list
     - Expanded match details
     - Loading and error states
   - Key functions:
     - `fetchSavedMatches`: Retrieves matches from the server
     - `processMatchData`: Formats match data for display
     - `handleDeleteMatch`: Manages match deletion

3. **RecentAnalysis.jsx**
   - Shows detailed analysis of recent matches
   - Manages state for:
     - Analysis data
     - Loading states
     - Error handling
   - Key functions:
     - `handleAnalysis`: Processes match data for AI analysis
     - `processSavedMatchData`: Formats saved match data

4. **EmptyTable.jsx**
   - Reusable component for displaying match data
   - Handles both editable and read-only views
   - Displays:
     - Match information (map, result, duration, date)
     - Team statistics
     - Player performance data

### Data Flow

1. **Data Entry Flow**:
   ```
   GenerateTable.jsx
   ├── User inputs match data
   ├── Data validation and formatting
   ├── POST to /process-match-data
   └── Updates RecentAnalysis.jsx
   ```

2. **Data Display Flow**:
   ```
   ListAll.jsx
   ├── Fetches matches from /matches
   ├── Processes data for display
   └── Renders EmptyTable.jsx
   ```

3. **Analysis Flow**:
   ```
   RecentAnalysis.jsx
   ├── Receives match data
   ├── POST to /analyze-match
   ├── Processes AI response
   └── Updates display
   ```

### Data Structure

1. **Match Data**:
   ```javascript
   {
     match_id: number,
     map: string,
     result: 'Victory' | 'Defeat' | 'Tie',
     match_date: timestamp,
     duration: string,
     all_players_data: {
       teamA: PlayerData[],
       teamB: PlayerData[]
     }
   }
   ```

2. **Player Data**:
   ```javascript
   {
     agent: string,
     rank: string,
     acs: number,
     kda: string,
     damage_delta: string,
     adr: number,
     hs_percent: string,
     first_kills: number,
     first_deaths: number
   }
   ```

### Database Schema

1. **matches**:
   - Primary table for match data
   - Stores match details and player statistics
   - Uses JSONB for flexible player data storage

2. **user_stats**:
   - Tracks user-specific statistics
   - Links to matches via foreign key
   - Cascades on match deletion

3. **match_analysis**:
   - Stores AI-generated match analysis
   - Links to matches via foreign key
   - Cascades on match deletion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

