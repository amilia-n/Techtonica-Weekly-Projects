# Contact List Application

A full-stack PERN (PostgreSQL, Express, React, Node.js) application for managing contacts with features like tagging, searching, and CRUD operations.

[![GitHub](https://img.shields.io/badge/GitHub-View%20on%20GitHub-blue)](https://github.com/amilia-n/Techtonica-Weekly-Projects/tree/main/Week%2011%20Contact%20List)

## Features

- 📱 View all contacts in a clean, organized list
- ➕ Add new contacts with required and optional fields
- ✏️ Edit existing contact information
- 🗑️ Delete contacts
- 🔍 Search contacts by name
- 🏷️ Tag contacts for better organization
- 📱 Responsive design for all screen sizes
- ✅ Form validation and error handling
- 🧪 Comprehensive test coverage

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/amilia-n/Techtonica-Weekly-Projects.git
cd "Week 11 Contact List"
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

# Create and populate the database
psql -f db/db.sql
```

4. Create a `.env` file in the server directory with the following variables:
```
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=contact_list
DB_HOST=localhost
DB_PORT=5432
PORT=3001
```

## Running the Application

1. Start the server:
```bash
cd server
npm start
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Documentation

### Endpoints

#### Contacts

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a specific contact
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact
- `GET /api/contacts/search?q=:query` - Search contacts by name

#### Tags

- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag
- `PUT /api/tags/:id` - Update a tag
- `DELETE /api/tags/:id` - Delete a tag
- `POST /api/contacts/:id/tags` - Add tags to a contact
- `DELETE /api/contacts/:id/tags/:tagId` - Remove a tag from a contact

### Request/Response Examples

#### Create Contact
```javascript
// POST /api/contacts
{
  "name": "John Doe",
  "phone": "555-123-4567",
  "email": "john@example.com",
  "note": "Work contact"
}
```

#### Update Contact
```javascript
// PUT /api/contacts/1
{
  "name": "John Doe",
  "phone": "555-987-6543",
  "email": "john.doe@example.com",
  "note": "Updated work contact"
}
```

## Component Setup

### Frontend Components

#### Contact.jsx
- Displays individual contact information
- Handles edit and delete operations
- Shows associated tags
- Props:
  - `contact`: Contact object
  - `onEdit`: Edit handler function
  - `onDelete`: Delete handler function
  - `onTagClick`: Tag click handler

#### AddContact.jsx
- Form for creating new contacts
- Form validation
- Tag selection
- Props:
  - `onSubmit`: Submit handler function
  - `tags`: Available tags array

### Component Hierarchy

```
App
├── ContactList
│   ├── Contact
│   │   └── Tag
│   └── SearchBar
├── AddContact
│   └── TagSelector
└── ContactDetail
    └── Tag
```

## Testing

Run tests for both client and server:

```bash
# Client tests
cd client
npm test

# Server tests
cd ../server
npm test
```

### Test Coverage

- Component rendering tests
- Form validation tests
- API integration tests
- Database operation tests
- Error handling tests

## Project Structure

```
contact-list/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Contact.jsx
│   │   │   ├── AddContact.jsx
│   │   │   └── __tests__/
│   │   ├── pages/        # Page components
│   │   └── assets/       # Static assets
│   └── __tests__/        # Frontend tests
├── server/                # Express backend
│   ├── db/               # Database setup
│   │   ├── db.sql       # Database schema and initial data
│   │   └── connect.js   # Database connection
│   └── __tests__/        # Backend tests
└── README.md
```

## Database Schema

The application uses two main tables:

### Contacts Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(50))
- phone (VARCHAR(20))
- email (VARCHAR(255))
- note (TEXT)

### Tags Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(30))

### Contact Tags Table (Junction Table)
- contact_id (INTEGER REFERENCES contacts(id))
- tag_id (INTEGER REFERENCES tags(id))

## Error Handling

The application implements comprehensive error handling:

### Frontend
- Form validation errors
- API request errors
- Network errors
- User feedback messages

### Backend
- Database connection errors
- Query errors
- Validation errors
- HTTP status codes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## Attributions

- Color palette and UI guidelines: [Material Design](https://m2.material.io/design/color/applying-color-to-ui.html#backdrop)
- Contact icons: [Freepik](https://www.flaticon.com/free-icons/contacts) on Flaticon
- UI icons: [Font Awesome](https://fontawesome.com/)
