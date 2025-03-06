import { useState } from 'react';
import '../styles/Question.css';

const Question = ({ question, options, correctAnswer, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    if (showResult) return;
    
    setSelectedAnswer(option);
    setShowResult(true);
    onAnswer(option === correctAnswer);
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index) + ')';
  };

  return (
    <div className="question-container">
      <div className="question-text">
        {question}
      </div>
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              showResult
                ? option === correctAnswer
                  ? 'correct'
                  : option === selectedAnswer
                  ? 'incorrect'
                  : ''
                : ''
            } ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
            disabled={showResult}
          >
            <span className="option-label">{getOptionLabel(index)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question; 