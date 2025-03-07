import React, { useState } from 'react';
import './App.css';
import QuizPage from './components/QuizPage';

function App() {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [questionCount, setQuestionCount] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const handleTopicSelect = (topic) => {
    setSelectedTopics(prevTopics => {
      if (prevTopics.includes(topic)) {
        return prevTopics.filter(t => t !== topic);
      } else {
        return [...prevTopics, topic];
      }
    });
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const handleQuestionCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 50)) {
      setQuestionCount(value);
    }
  };

  const handleStartQuiz = () => {
    if (selectedTopics.length > 0 && selectedDifficulty && selectedType && questionCount) {
      setIsQuizStarted(true);
    } else {
      alert('Please select at least one topic, difficulty, question type, and number of questions.');
    }
  };

  const handleReturnToStart = () => {
    setIsQuizStarted(false);
    setSelectedTopics([]);
    setQuestionCount('');
    setSelectedDifficulty(null);
    setSelectedType(null);
  };

  if (isQuizStarted) {
    return (
      <QuizPage
        selectedTopics={selectedTopics}
        questionCount={questionCount}
        difficulty={selectedDifficulty}
        questionType={selectedType}
        onReturnToStart={handleReturnToStart}
      />
    );
  }

  return (
    <div className="app">
      <div className="main-box">
        <h1 className="title">Super Fun Trivia Game</h1>
        <h3 className="header">Select your categories:</h3>
        
        {/* First row of topic buttons */}
        <div className="button-row">
          <button 
            className={`topic-button ${selectedTopics.includes('JavaScript') ? 'selected' : ''}`}
            onClick={() => handleTopicSelect('JavaScript')}
          >
            JavaScript
          </button>
          <button 
            className={`topic-button ${selectedTopics.includes('CSS') ? 'selected' : ''}`}
            onClick={() => handleTopicSelect('CSS')}
          >
            CSS
          </button>
          <button 
            className={`topic-button ${selectedTopics.includes('HTML') ? 'selected' : ''}`}
            onClick={() => handleTopicSelect('HTML')}
          >
            HTML
          </button>
        </div>

        {/* Second row of topic buttons */}
        <div className="button-row">
          <button 
            className={`topic-button ${selectedTopics.includes('React') ? 'selected' : ''}`}
            onClick={() => handleTopicSelect('React')}
          >
            React
          </button>
          <button 
            className={`topic-button ${selectedTopics.includes('Testing') ? 'selected' : ''}`}
            onClick={() => handleTopicSelect('Testing')}
          >
            Testing
          </button>
          <button 
            className={`topic-button ${selectedTopics.includes('JavaScript Methods') ? 'selected' : ''}`}
            onClick={() => handleTopicSelect('JavaScript Methods')}
          >
            JavaScript Methods
          </button>
        </div>

        {/* Japanese Anime button */}
        <button 
          className={`single-button ${selectedTopics.includes('Japanese Anime') ? 'selected' : ''}`}
          onClick={() => handleTopicSelect('Japanese Anime')}
        >
          Japanese Anime
        </button>

        {/* Number of questions input */}
        <div className="input-container">
          <label htmlFor="questions">Number of Questions:</label>
          <input 
            type="number" 
            id="questions" 
            min="1"
            max="50"
            value={questionCount}
            onChange={handleQuestionCountChange}
            placeholder="Enter a Number"
          />
        </div>

        {/* Difficulty buttons */}
        <div className="button-row">
          <button 
            className={`topic-button ${selectedDifficulty === 'Easy' ? 'selected' : ''}`}
            onClick={() => handleDifficultySelect('Easy')}
          >
            Easy
          </button>
          <button 
            className={`topic-button ${selectedDifficulty === 'Medium' ? 'selected' : ''}`}
            onClick={() => handleDifficultySelect('Medium')}
          >
            Medium
          </button>
          <button 
            className={`topic-button ${selectedDifficulty === 'Hard' ? 'selected' : ''}`}
            onClick={() => handleDifficultySelect('Hard')}
          >
            Hard
          </button>
        </div>

        {/* Question type buttons */}
        <div className="button-row">
          <button 
            className={`topic-button ${selectedType === 'Multiple Choice' ? 'selected' : ''}`}
            onClick={() => handleTypeSelect('Multiple Choice')}
          >
            Multiple Choice
          </button>
          <button 
            className={`topic-button ${selectedType === 'Truth or False' ? 'selected' : ''}`}
            onClick={() => handleTypeSelect('Truth or False')}
          >
            Truth or False
          </button>
        </div>

        {/* Start quiz button */}
        <button 
          className="start-button"
          onClick={handleStartQuiz}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default App; 