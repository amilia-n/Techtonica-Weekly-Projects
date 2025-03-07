import { useState } from 'react';
import '../styles/Question.css';

const Question = ({ question, options, correctAnswer, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    if (showResult) return;
    
    setSelectedAnswer(option);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(option === correctAnswer);
    }, 1000);
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index) + ')';
  };

  const getOptionClass = (option) => {
    if (!showResult) {
      return selectedAnswer === option ? 'selected' : '';
    }
    
    if (option === correctAnswer) {
      return 'correct';
    }
    
    if (option === selectedAnswer && option !== correctAnswer) {
      return 'incorrect';
    }
    
    return '';
  };

  return (
    <div className="question-container">
      <div className="question-text">
        {question.split('\n').map((line, index) => (
          <div key={index}>
            <strong>{line.split(':')[0]}:</strong> {line.split(':')[1]}
          </div>
        ))}
      </div>
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${getOptionClass(option)}`}
            onClick={() => handleOptionClick(option)}
            disabled={showResult}
          >
            <span className="option-label">{getOptionLabel(index)}</span>
            <span className="option-text">{option}</span>
            {showResult && (
              <span className="feedback-icon">
                {option === correctAnswer ? '✓' : 
                  (option === selectedAnswer ? '✗' : '')}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question; 