import React, { useState, useEffect } from 'react';
import './Test.css';
import Result from './Result';

// Helper function to shuffle an array (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array]; // Make a copy to avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};

const Test = ({ testData, onTestCompleted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null); // State to hold remaining time
  const [shuffledOptions, setShuffledOptions] = useState([]); // State to hold shuffled options

  const { metadata, data: questions } = testData;
  const { testName, duration, subject, marks } = metadata[0]; // Assuming testTime is in minutes

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const testId = testData._id;
  const rollno = sessionStorage.getItem('rollno');
  const division = sessionStorage.getItem('division');
  const studentId = sessionStorage.getItem('userId');

  // Shuffle the options whenever the currentQuestionIndex changes
  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (duration) {
      // Convert duration from minutes to seconds
      setRemainingTime(duration * 60);
    }
  }, [duration]);

  useEffect(() => {
    let timer;
    if (remainingTime > 0 && !submitted) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      // Auto-submit when time runs out
      handleSubmit();
    }

    return () => clearInterval(timer);
  }, [remainingTime, submitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionChange = (option) => {
    if (currentQuestion.questionType === "Multi_choice") {
      // For multi-choice questions, toggle the selected answer
      const selectedAnswers = userAnswers[currentQuestion.id] || [];
      const isSelected = selectedAnswers.includes(option);
  
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.id]: isSelected
          ? selectedAnswers.filter((answer) => answer !== option) // Remove if already selected
          : [...selectedAnswers, option], // Add if not selected
      });
    } else {
      // For single choice questions, store only one answer
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.id]: option,
      });
    }
  };
  

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onTestCompleted(); // Inform parent component that test is completed
  };

  return (
    <div className="test-container" style={{ marginLeft: '20px' }}>
      <div className="header">
        <h1 className='me-3'>{testName}</h1>
        <p className='mx-4'>
          Question {currentQuestionIndex + 1} of {totalQuestions} | Time Remaining: {formatTime(remainingTime)}
        </p>
      </div>
      {!submitted ? (
        <div className="question-container">
          <h3>{currentQuestion.question}</h3>

          {/* Display image if present for the current question */}
          {currentQuestion.image && (
            <div className="question-image">
              <img src={currentQuestion.image} alt="Question" style={{ width: '300px', marginTop: '20px' }} />
            </div>
          )}

          <div className="options">
            {shuffledOptions.map((option, index) => (
              <div
                key={index}
                className={`option ${userAnswers[currentQuestion.id]?.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionChange(option)}
              >
                <input
                  type={currentQuestion.questionType === "Multi_choice" ? "checkbox" : "radio"}
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={
                    currentQuestion.questionType === "Multi_choice"
                      ? userAnswers[currentQuestion.id]?.includes(option)
                      : userAnswers[currentQuestion.id] === option
                  }
                  onChange={() => handleOptionChange(option)}
                />
                <label>{option}</label>
              </div>
            ))}
          </div>

          <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <button onClick={handleSkip}>Skip</button>
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button onClick={handleSubmit}>Submit</button>
            ) : (
              <button onClick={handleNext}>Next</button>
            )}
          </div>
        </div>
      ) : (
        <Result
          questions={questions}
          userAnswers={userAnswers}
          testName={testName}
          marks={marks}
          studentId={studentId}
          subject={subject}
          testId={testId}
          rollno={rollno}
          division={division}
        />
      )}
    </div>
  );
};

export default Test;
