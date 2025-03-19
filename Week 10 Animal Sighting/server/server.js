const app = require('./app');
require('dotenv').config();
console.log("where is Ami's", process.env)
const client = require('./db/connect');

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});