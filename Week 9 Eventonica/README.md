# Eventonica - Event Management Application

A full-stack event management application built with React, Express, and PostgreSQL. This application allows users to manage events and participants, with features for filtering, sorting, and real-time updates.

## Features

### Event Management
- Create, edit, and delete events
- Event details include:
  - Name
  - Date and time
  - Location
  - Description
  - Category
  - Pin/Unpin functionality
- Filter events by:
  - Name/description search
  - Date range
  - Category
- Sort events by various fields

### Participant Management
- Add and manage event participants
- Participant details include:
  - First and last name
  - Email
  - Status (Host, Guest, Volunteer, etc.)
  - Notes
  - Attendance tracking

### User Interface
- Modern, responsive design
- Navigation through:
  - Home page
  - Event Management
  - Calendar view
- Real-time updates
- Mobile-friendly layout

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Modern CSS with Grid/Flexbox
- Moment.js for date handling
- React Big Calendar for calendar view
- Custom heart animation for event pinning

### Backend
- Node.js with Express
- PostgreSQL database
- RESTful API design

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Database Setup
1. Create a PostgreSQL database:
```bash
createdb eventonica
```

2. Set up the database schema:
```bash
cd server
psql -d eventonica -f schema.sql
```

3. Load sample data (optional):
```bash
node loadMockData.js
```

### Server Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with your database configuration:
```
DB_USER=postgres
DB_PASSWORD=mypassword
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=eventonica
PORT=3000
```

4. Start the server:
```bash
npm start
```

### Client Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Events
- GET /api/events - Get all events
- POST /api/events - Create a new event
- PATCH /api/events/:id - Update an event
- DELETE /api/events/:id - Delete an event
- PATCH /api/events/:id/pin - Toggle event pin status

### Participants
- GET /api/participants - Get all participants
- POST /api/participants - Add a new participant
- GET /api/events/:eventId/participants - Get participants for an event
- PATCH /api/participants/:id/attendance - Toggle participant attendance

## Credits

### Third-Party Components
- Heart Animation: Inspired by [CSS-Tricks' Twitter Heart Animation](https://css-tricks.com/recreating-the-twitter-heart-animation/) by Ana Tudor
- Calendar View: Implemented using [React Big Calendar](https://www.npmjs.com/package/@changwoolab/react-native-big-calendar)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
