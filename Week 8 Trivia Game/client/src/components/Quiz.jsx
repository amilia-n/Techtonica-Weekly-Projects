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


export default Quiz; 