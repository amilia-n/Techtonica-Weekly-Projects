/**
 * Main App Component
 * Handles the game setup and configuration interface
 * Manages topic selection, difficulty, and question type
 */

import React, { useState } from 'react';
import './App.css';
import QuizPage from './components/QuizPage';

function App() {
  // Game configuration state
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [questionCount, setQuestionCount] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  /**
   * Handles topic selection/deselection
   * Toggles topic in the selectedTopics array
   * topic: The topic to toggle
   */
  const handleTopicSelect = (topic) => {
    setSelectedTopics(prevTopics => {
      if (prevTopics.includes(topic)) {
        return prevTopics.filter(t => t !== topic);
      } else {
        return [...prevTopics, topic];
      }
    });
  };

  /**
   * Handles difficulty level selection
   * Toggles between difficulty levels or deselects if same difficulty clicked
   * @param {string} difficulty - The difficulty level to set
   */
  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty);
  };

  /**
   * Handles question type selection
   * Toggles between question types or deselects if same type clicked
   * type (str): The question type to set
   */
  const handleTypeSelect = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };

  /**
   * Validates and processes question count input
   * Ensures count is between 1 and 50
   * e: Input change event
   */
  const handleQuestionCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 50)) {
      setQuestionCount(value);
    }
  };

  /**
   * Validates game configuration and starts the quiz
   * Ensures all required options are selected
   */
  const handleStartQuiz = () => {
    if (selectedTopics.length > 0 && selectedDifficulty && selectedType && questionCount) {
      setIsQuizStarted(true);
    } else {
      alert('Please select at least one topic, difficulty, question type, and number of questions.');
    }
  };

  /**
   * Resets game configuration to initial state
   * Called when returning to start screen
   */
  const handleReturnToStart = () => {
    setIsQuizStarted(false);
    setSelectedTopics([]);
    setQuestionCount('');
    setSelectedDifficulty(null);
    setSelectedType(null);
  };

  // Render quiz page if game is started
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

  // Render game setup interface
  return (
    <div className="app">
      <div className="main-box">
        <h1 className="title">Super Fun Trivia Game</h1>
        <h3 className="header">Select your categories:</h3>
        
        {/* Topic selection buttons - first row */}
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

        {/* Topic selection buttons - second row */}
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

        {/* Special category button */}
        <button 
          className={`single-button ${selectedTopics.includes('Japanese Anime') ? 'selected' : ''}`}
          onClick={() => handleTopicSelect('Japanese Anime')}
        >
          Japanese Anime
        </button>

        {/* Question count input */}
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

        {/* Difficulty selection buttons */}
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

        {/* Question type selection */}
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

        {/* Start game button */}
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