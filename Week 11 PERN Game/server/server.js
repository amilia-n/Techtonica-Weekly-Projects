const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - more permissive for development
app.use(cors());

app.use(express.json());

// Routes
const playersRouter = require('./routes/players');
app.use('/api/players', playersRouter);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Game API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 