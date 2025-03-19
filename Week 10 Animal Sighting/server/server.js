const app = require('./app');
const client = require('./db/connect');

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});