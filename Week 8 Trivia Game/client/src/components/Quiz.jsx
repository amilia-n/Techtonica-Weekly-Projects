import { useState, useEffect } from 'react';
import Question from './Question';
import '../styles/Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [nextQuestions, setNextQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerId, setTimerId] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/questions?difficulty=${difficulty}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
      setTotalQuestions(data.length);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    fetchQuestions();
  };

  return (
    <div className="quiz-container">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>Welcome to the Quiz Game!</h1>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={startGame}>Start Quiz</button>
        </div>
      ) : loading ? (
        <div>Loading questions...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          {/* ... existing JSX ... */}
        </div>
      )}
    </div>
  );
};

export default Quiz; 