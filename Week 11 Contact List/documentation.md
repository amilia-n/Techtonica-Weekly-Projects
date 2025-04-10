# Technical Documentation: Contact List Application

## Architecture Overview

### Frontend Architecture

#### Component Architecture

The application follows a hierarchical component structure with clear separation of concerns:

1. **Home Component (Container)**
   - Primary state management hub
   - Manages application-wide state:
     ```javascript
     {
       showAddContact: boolean,
       editingContact: Contact | null
     }
     ```
   - Implements core handlers:
     - `handleAddContact`: Toggles add contact form
     - `handleEditContact`: Initializes edit mode
     - `handleCloseAddContact`: Form dismissal logic

2. **Contact Component (List View)**
   - Manages contact list state and operations
   - State structure:
     ```javascript
     {
       contacts: Contact[],
       loading: boolean,
       error: Error | null,
       searchQuery: string,
       selectedContact: Contact | null,
       showIndividual: boolean,
       isEditing: boolean,
       editFormData: ContactFormData
     }
     ```
   - Core functionalities:
     - Contact fetching and caching
     - Search implementation with debouncing
     - CRUD operations for contacts
     - Individual contact view management

3. **AddContact Component (Form)**
   - Reusable form component for create/edit operations
   - State management:
     ```javascript
     {
       formData: {
         firstName: string,
         lastName: string,
         phone: string,
         email: string,
         note: string,
         tags: string[]
       },
       error: Error | null,
       loading: boolean
     }
     ```
   - Form validation and submission logic

### Backend Architecture

#### Server Configuration

1. **Environment Setup**
   ```javascript
   {
     PORT: number,
     DATABASE_URL: string,
     NODE_ENV: 'development' | 'production'
   }
   ```

2. **Middleware Stack**
   - CORS configuration
   - Request parsing
   - Error handling
   - Authentication (if implemented)

#### Database Architecture

1. **Schema Design**
   ```sql
   -- Contacts Table
   CREATE TABLE contacts (
     id SERIAL PRIMARY KEY,
     name VARCHAR(50) NOT NULL,
     phone VARCHAR(20) NOT NULL,
     email VARCHAR(255),
     note TEXT
   );

   -- Tags Table
   CREATE TABLE tags (
     id SERIAL PRIMARY KEY,
     name VARCHAR(30) UNIQUE NOT NULL
   );

   -- Junction Table
   CREATE TABLE contact_tags (
     contact_id INTEGER REFERENCES contacts(id),
     tag_id INTEGER REFERENCES tags(id),
     PRIMARY KEY (contact_id, tag_id)
   );
   ```

2. **Query Optimization**
   - Indexed columns:
     - `contacts(name)`
     - `tags(name)`
     - `contact_tags(contact_id, tag_id)`
   - Optimized JOIN operations
   - Efficient text search using ILIKE

## Technical Implementation Details

### Search Implementation

1. **Frontend Search Logic**
   ```javascript
   const debouncedSearch = debounce((query) => {
     fetchContacts(query);
   }, 300);
   ```

2. **Backend Search Query**
   ```sql
   SELECT c.*, string_agg(t.name, ',') as tags
   FROM contacts c
   LEFT JOIN contact_tags ct ON c.id = ct.contact_id
   LEFT JOIN tags t ON ct.tag_id = t.id
   WHERE 
     LOWER(c.name) ILIKE LOWER($1) OR
     LOWER(c.phone) ILIKE LOWER($1) OR
     LOWER(t.name) ILIKE LOWER($1)
   GROUP BY c.id
   ORDER BY c.name;
   ```

### State Management

1. **Contact State Updates**
   ```javascript
   const handleEditSubmit = async (e) => {
     e.preventDefault();
     try {
       const response = await fetch(`/api/contacts/${editingContact.id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(editFormData)
       });
       if (response.ok) {
         fetchContacts();
         setIsEditing(false);
       }
     } catch (error) {
       setError(error.message);
     }
   };
   ```

2. **Form State Management**
   ```javascript
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData(prev => ({
       ...prev,
       [name]: value
     }));
   };
   ```

### Error Handling

1. **Frontend Error Management**
   - Form validation errors
   - API request errors
   - Network errors
   - User feedback system

2. **Backend Error Handling**
   ```javascript
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({
       error: 'Internal Server Error',
       message: process.env.NODE_ENV === 'development' ? err.message : undefined
     });
   });
   ```

## Performance Considerations

1. **Frontend Optimization**
   - Debounced search to prevent excessive API calls
   - Memoized components using React.memo
   - Lazy loading for modal components
   - Efficient state updates

2. **Backend Optimization**
   - Connection pooling for database
   - Cached queries where appropriate
   - Optimized JOIN operations
   - Indexed search columns

## Security Measures

1. **Input Validation**
   - Sanitized SQL queries using parameterized statements
   - Form validation on both client and server
   - XSS prevention through proper escaping

2. **Data Protection**
   - Secure database credentials management
   - HTTPS enforcement in production
   - Rate limiting for API endpoints

## Testing Strategy

1. **Unit Tests**
   - Component rendering tests
   - State management tests
   - Form validation tests
   - API integration tests

2. **Integration Tests**
   - Database operation tests
   - API endpoint tests
   - End-to-end workflow tests

