import React, { useState, useEffect } from 'react';
import '../App.css';

function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

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
  const [questions, setQuestions] = useState([]); 
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const getSessionToken = async () => {
    try {
      const response = await fetch('https://opentdb.com/api_token.php?command=request');
      const data = await response.json();
      if (data.response_code === 0) {
        return data.token;
      }
      return null;
    } catch (error) {
      console.error('Error getting session token:', error);
      return null;
    }
  };

  const fetchQuestions = async (retryCount = 0) => {
    try {
      console.log('Fetching questions...');
      setLoading(true);
      setError(null);

      if (!selectedTopics || !selectedTopics.length) {
        console.log('No topics selected in fetch. Topics:', selectedTopics);
        throw new Error('Please select at least one topic to start the quiz.');
      }

      let questions = [];
      
      // Special handling for Japanese Anime topic
      if (selectedTopics.includes('Japanese Anime')) {
        // Rate limiting: Wait at least 5 seconds between requests
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime;
        if (timeSinceLastFetch < 5000) {
          await new Promise(resolve => setTimeout(resolve, 5000 - timeSinceLastFetch));
        }
        
        // Get session token if we don't have one
        if (!sessionToken) {
          const token = await getSessionToken();
          setSessionToken(token);
        }

        const type = questionType === 'Truth or False' ? 'boolean' : 'multiple';
        const apiUrl = `https://opentdb.com/api.php?amount=${questionCount}&category=31&type=${type}${sessionToken ? `&token=${sessionToken}` : ''}`;
        
        console.log('Fetching from OpenTDB:', apiUrl);
        
        try {
          const response = await fetch(apiUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json'
            }
          });
          
          setLastFetchTime(Date.now());
          console.log('OpenTDB Response status:', response.status);
          
          if (response.status === 429) {
            // If rate limited, wait and retry
            if (retryCount < 3) {
              console.log('Rate limited, waiting before retry...');
              await new Promise(resolve => setTimeout(resolve, 5000));
              return fetchQuestions(retryCount + 1);
            }
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenTDB Error response:', errorText);
            throw new Error(`Failed to fetch from OpenTDB: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('OpenTDB Response data:', data);
          
          if (data.response_code === 4) {
            // Token expired, get a new one and retry
            const newToken = await getSessionToken();
            setSessionToken(newToken);
            if (retryCount < 3) {
              return fetchQuestions(retryCount + 1);
            }
          }
          
          if (data.response_code !== 0) {
            const errorMessages = {
              1: 'No results found',
              2: 'Invalid parameter',
              3: 'Token not found',
              4: 'Token empty',
              5: 'Rate limit exceeded'
            };
            throw new Error(`OpenTDB Error: ${errorMessages[data.response_code] || 'Unknown error'}`);
          }
          
          questions = data.results.map(q => ({
            question: decodeHTMLEntities(q.question),
            options: q.type === 'boolean' ? ['True', 'False'] : 
              [...q.incorrect_answers, q.correct_answer]
                .map(decodeHTMLEntities)
                .sort(() => Math.random() - 0.5),
            answer: decodeHTMLEntities(q.correct_answer)
          }));
        } catch (error) {
          console.error('Error fetching from OpenTDB:', error);
          throw new Error(`Failed to fetch anime questions: ${error.message}`);
        }
      } else {
        // Original fetch logic for other topics
        const categoryParam = selectedTopics.join(',').toLowerCase();
        const type = questionType === 'Truth or False' ? 'boolean' : 'multiple';
        const apiUrl = `/api/questions?categories=${categoryParam}&difficulty=${difficulty.toLowerCase()}&numQuestions=${questionCount}&type=${type}`;
        
        console.log('Fetching from local API:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch questions' }));
          throw new Error(errorData.error || 'Failed to fetch questions');
        }
        
        questions = await response.json();
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions available for the selected criteria');
      }

      // Reset all states when new questions are loaded
      setQuestions(questions);
      setCurrentQuestionIndex(0);
      setQuestionsAnswered(0);
      setScore(0);
      setLoading(false);
      setError(null);

      console.log('Questions loaded successfully:', {
        count: questions.length,
        firstQuestion: questions[0]
      });
    } catch (err) {
      console.error('Error fetching questions:', err);
      
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
    }
  };

  // Call fetchQuestions immediately when the component mounts with valid props
  useEffect(() => {
    console.log('QuizPage mounted with props:', {
      selectedTopics,
      questionCount,
      difficulty,
      questionType
    });
    
    if (selectedTopics && selectedTopics.length > 0) {
      console.log('Fetching questions with topics:', selectedTopics);
      fetchQuestions();
    } else {
      console.log('No topics selected, skipping fetch. Topics:', selectedTopics);
      setLoading(false);
    }
  }, [selectedTopics, questionCount, difficulty, questionType]); // Include all dependencies

  const resetStates = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setIsGameEnded(false);
    setCurrentQuestionIndex(0);
    setLoading(true);
    setError(null);
    fetchQuestions();
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

  if (loading && !questions.length) {
    return (
      <div className="app">
        <div className="quiz-box">
          <div className="loading">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="quiz-box">
          <div className="error">{error}</div>
          <button className="return-button" onClick={handleReturnHome}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!selectedTopics || !selectedTopics.length) {
    return (
      <div className="app">
        <div className="quiz-box">
          <div className="error">Please select at least one topic to start the quiz.</div>
          <button className="return-button" onClick={handleReturnHome}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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
        {questions.length > 0 ? (
          <div>
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
        ) : (
          <div className="error">No questions loaded</div>
        )}
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