import { useState } from 'react';
import Question from './Question';
import '../styles/Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Game settings
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('multiple');

  const categories = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'css', label: 'CSS' },
    { id: 'html', label: 'HTML' },
    { id: 'react', label: 'React' },
    { id: 'testing', label: 'Testing' },
    { id: 'node', label: 'Node.js' },
    { id: 'javascript_methods', label: 'JavaScript Methods' }
  ];

  const toggleCategory = (categoryId) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const fetchQuestions = async (retryCount = 0) => {
    try {
      console.log('Fetching questions...');
      setLoading(true);
      setError(null);

      const categoryParam = Array.from(selectedCategories).join(',');
      
      const url = new URL('http://localhost:3000/api/questions');
      url.searchParams.append('categories', categoryParam);
      url.searchParams.append('difficulty', difficulty);
      url.searchParams.append('numQuestions', numQuestions.toString());
      url.searchParams.append('type', questionType);

      console.log('Fetching from URL:', url.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch questions');
      }
      
      const data = await response.json();
      console.log('Received questions:', data);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No questions available for the selected criteria');
      }

      setQuestions(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      
      // If it's a connection error and we haven't retried too many times
      if (err.message === 'Failed to fetch' && retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        setTimeout(() => fetchQuestions(retryCount + 1), 1000);
        return;
      }
      
      setError(err.message === 'Failed to fetch' 
        ? 'Unable to connect to the server. Please make sure the server is running and try again.' 
        : err.message
      );
      setLoading(false);
      setGameStarted(false);
    }
  };

  const startGame = async () => {
    console.log('Start button clicked');
    console.log('Selected categories:', selectedCategories);
    
    if (selectedCategories.size === 0) {
      setError('Please select at least one category');
      return;
    }
    
    console.log('Starting game with settings:', {
      categories: Array.from(selectedCategories),
      difficulty,
      numQuestions,
      questionType
    });
    
    setError(null);
    setGameStarted(true);
    await fetchQuestions();
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    // Wait for the feedback animation to complete before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        setGameFinished(true);
      }
    }, 1000); // Match this with the delay in Question component
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameFinished(false);
    setGameStarted(false);
    setError(null);
    setSelectedCategories(new Set());
  };

  return (
    <div className="quiz-container">
      {!gameStarted ? (
        <div className="start-screen">
          <div className="question-card">
            <h1>Welcome to the Quiz Game!</h1>
            
            <div className="categories-section">
              <h2>Select Categories</h2>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-button ${selectedCategories.has(category.id) ? 'selected' : ''}`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="game-settings">
              <div className="questions-input">
                <label htmlFor="numQuestions">Number of Questions:</label>
                <input
                  id="numQuestions"
                  type="number"
                  min="5"
                  max="50"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.max(5, Math.min(50, Number(e.target.value))))}
                />
              </div>

              <div className="difficulty-buttons">
                {['easy', 'medium', 'hard'].map(diff => (
                  <button
                    key={diff}
                    className={`difficulty-button ${difficulty === diff ? 'selected' : ''}`}
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>

              <div className="type-buttons">
                <button
                  className={`type-button ${questionType === 'multiple' ? 'selected' : ''}`}
                  onClick={() => setQuestionType('multiple')}
                >
                  Multiple Choice
                </button>
                <button
                  className={`type-button ${questionType === 'boolean' ? 'selected' : ''}`}
                  onClick={() => setQuestionType('boolean')}
                >
                  True/False
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <button 
              className="start-button" 
              onClick={startGame}
              disabled={selectedCategories.size === 0}
            >
              Start Quiz
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="loading">Loading questions...</div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={resetGame}>Try Again</button>
        </div>
      ) : questions.length > 0 ? (
        gameFinished ? (
          <div className="game-finished">
            <h2>Game Over!</h2>
            <div className="final-score">
              <p>Your Score: {score}/{questions.length}</p>
              <p className="score-percentage">
                ({Math.round((score / questions.length) * 100)}%)
              </p>
            </div>
            <button onClick={resetGame}>Play Again</button>
          </div>
        ) : (
          <div className="game-screen">
            <div className="question-card">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <div className="game-header">
                <div className="progress">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="score">
                  Score: {score}
                </div>
              </div>
              {(() => {
                if (questionType === 'boolean') {
                  return (
                    <Question
                      key={currentQuestionIndex}
                      question={`Question: ${questions[currentQuestionIndex].question}`}
                      options={['True', 'False']}
                      correctAnswer={questions[currentQuestionIndex].answer}
                      onAnswer={handleAnswer}
                    />
                  );
                } else {
                  return (
                    <Question
                      key={currentQuestionIndex}
                      question={questions[currentQuestionIndex].question}
                      options={questions[currentQuestionIndex].options}
                      correctAnswer={questions[currentQuestionIndex].answer}
                      onAnswer={handleAnswer}
                    />
                  );
                }
              })()}
            </div>
          </div>
        )
      ) : (
        <div className="error">
          <p>No questions available. Please try different settings.</p>
          <button onClick={resetGame}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default Quiz; 