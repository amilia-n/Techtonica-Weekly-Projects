import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Read quiz data
let quizData;
try {
  const filePath = path.join(__dirname, 'quizz.json');
  console.log('Reading quiz data from:', filePath);
  quizData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('Available categories:', Object.keys(quizData.quiz.levels));
} catch (error) {
  console.error('Error reading quiz data:', error);
  quizData = { quiz: { levels: {} } };
}

// Endpoint to get questions
app.get('/api/questions', (req, res) => {
  try {
    console.log('Received request with query params:', req.query);
    const { categories, difficulty, numQuestions, type } = req.query;
    
    // Parse the categories from the query string
    const selectedCategories = categories ? categories.split(',') : ['javascript'];
    const questionDifficulty = difficulty || 'medium';
    const amount = parseInt(numQuestions) || 10;
    const questionType = type || 'multiple';

    console.log('Processing request with:', {
      selectedCategories,
      questionDifficulty,
      amount,
      questionType
    });

    let allQuestions = [];

    // Gather questions from all selected categories
    selectedCategories.forEach(category => {
      console.log(`Checking category: ${category}`);
      if (quizData.quiz.levels[category] && quizData.quiz.levels[category][questionDifficulty]) {
        let questions = quizData.quiz.levels[category][questionDifficulty];
        console.log(`Found ${questions.length} questions for ${category} at ${questionDifficulty} difficulty`);
        
        // Convert questions to T/F if boolean type is selected
        if (questionType === 'boolean') {
          questions = questions.map(q => {
            let randomOption = q.options[Math.floor(Math.random() * q.options.length)];
            return{
            question: q.question + `\n Answer: ${randomOption}`,
            options: ['True', 'False'],
            answer: randomOption === q.answer ? 'True' : 'False'
          }
        });
        }
        
        allQuestions = allQuestions.concat(questions);
      } else {
        console.log(`No questions found for category ${category} at ${questionDifficulty} difficulty`);
      }
    });

    console.log(`Total questions gathered: ${allQuestions.length}`);

    // Shuffle the questions
    allQuestions = allQuestions.sort(() => Math.random() - 0.5);

    // Limit to requested number of questions
    const selectedQuestions = allQuestions.slice(0, amount);

    if (selectedQuestions.length === 0) {
      throw new Error('No questions found for the selected criteria');
    }

    console.log(`Returning ${selectedQuestions.length} ${questionType} questions from categories: ${selectedCategories.join(', ')}`);
    res.json(selectedQuestions);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(400).json({ error: error.message || 'Failed to get questions' });
  }
});

// Add an endpoint to get available categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = Object.keys(quizData.quiz.levels);
    console.log('Returning available categories:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
