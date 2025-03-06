const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// grabs quiz data
const quizData = JSON.parse(fs.readFileSync(path.join(__dirname, 'quizz.json'), 'utf8'));

// Endpoint to get questions
app.get('/api/questions', (req, res) => {
  const { difficulty = 'medium', category = 'javascript' } = req.query;
  
  try {
    const questions = quizData.quiz.levels[category][difficulty];
    res.json(questions);
  } catch (error) {
    res.status(400).json({ error: 'Invalid difficulty or category' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
