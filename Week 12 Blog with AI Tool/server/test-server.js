const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  console.log('GET /test called');
  res.json({ message: 'Test server is working' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}); 