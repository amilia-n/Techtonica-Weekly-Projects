/**
 * Trivia Game Server
 * This Express server handles trivia game functionality including:
 * - Serving questions from local JSON and external API
 * - Managing categories and difficulty levels
 * - Handling question type conversions
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES Module compatibility setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup for CORS and JSON parsing
app.use(cors());
app.use(express.json());

/**
 * Quiz Data Initialization
 * Loads question data from local JSON file
 * Contains categories, difficulty levels, and questions
 */
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

/**
 * GET /api/questions
 * Retrieves questions based on user preferences
 * categories - Comma-separated list of categories
 * difficulty - Question difficulty (easy, medium, hard)
 * numQuestions - Number of questions to return
 * type - Question type (multiple/boolean)
 * Array of question objects matching criteria
 */
app.get('/api/questions', (req, res) => {
  try {
    console.log('Received request with query params:', req.query);
    const { categories, difficulty, numQuestions, type } = req.query;
    
    // Default values and parameter processing
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

    // Process each selected category
    selectedCategories.forEach(category => {
      console.log(`Checking category: ${category}`);
      if (quizData.quiz.levels[category] && quizData.quiz.levels[category][questionDifficulty]) {
        let questions = quizData.quiz.levels[category][questionDifficulty];
        console.log(`Found ${questions.length} questions for ${category} at ${questionDifficulty} difficulty`);
        
        // Convert multiple choice to boolean if needed
        if (questionType === 'boolean') {
          questions = questions.map(q => {
            let randomOption = q.options[Math.floor(Math.random() * q.options.length)];
            return{
            question: q.question + `\nAnswer: ${randomOption}`,
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

    // Randomize question order
    allQuestions = allQuestions.sort(() => Math.random() - 0.5);

    // Select requested number of questions
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

/**
 * GET /api/categories
 * Returns list of available question categories
 * returns Array of category names
 */
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
