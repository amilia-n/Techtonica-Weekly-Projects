import { useState, useEffect } from 'react';
import '../styles/Quiz.css';

const Question = ({ question, options, onAnswer, correctAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

export default Question; 