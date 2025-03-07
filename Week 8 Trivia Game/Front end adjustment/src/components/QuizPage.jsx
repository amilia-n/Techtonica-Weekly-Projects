import React, { useState } from 'react';
import '../App.css';

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

  // Extract just the question part from the full text
  const questionText = question.split('\n').find(line => line.startsWith('Question:'))?.split(':')[1]?.trim() || question;

  return (
    <div className="question-container">
      <div className="question-text">
        {questionText}
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

function QuizPage({ selectedTopics, questionCount, difficulty, questionType, onReturnToStart }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        "var myVariable = 10;",
        "variable myVariable = 10;",
        "let myVariable = 10;",
        "const myVariable = 10;"
      ],
      answer: "let myVariable = 10;"
    }
  ]); // This will be replaced with DB data later
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isGameEnded, setIsGameEnded] = useState(false);

  const resetStates = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setIsGameEnded(false);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setQuestionsAnswered(prev => prev + 1);
    
    setTimeout(() => {
      if (questionsAnswered + 1 >= questionCount) {
        setIsGameEnded(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1000);
  };

  const handleRestart = () => {
    resetStates();
    onReturnToStart();
  };

  const handleEndGame = () => {
    setIsGameEnded(true);
  };

  const handleReturnHome = () => {
    resetStates();
    onReturnToStart();
  };

  if (isGameEnded) {
    const percentage = (score / questionsAnswered) * 100;
    const isWinner = percentage >= 65;

    return (
      <div className="app">
        <div className="end-box">
          <h1 className="end-header">
            {isWinner ? "You Win!" : "Try Again!"}
          </h1>
          <div className="score-display">
            Score: {percentage.toFixed(1)}%
          </div>
          <button 
            className="return-button"
            onClick={handleReturnHome}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="quiz-box">
        <div className="game-header">
          <div className="header-top">
            <div className="progress-text">Question {questionsAnswered + 1} of {questionCount}</div>
            <div className="score">Score: {score}</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(questionsAnswered / questionCount) * 100}%` }}
            ></div>
          </div>
        </div>
        <div>
          {(() => {
            if (questionType === 'Truth or False') {
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
        <div className="control-buttons">
          <button 
            className="control-button restart-button"
            onClick={handleRestart}
          >
            Restart
          </button>
          <button 
            className="control-button end-button"
            onClick={handleEndGame}
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;