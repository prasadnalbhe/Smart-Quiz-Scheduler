import React, { useState, useEffect } from 'react';
import './Result.css';
 
import ViewResults from '../../../Student/ViewResults';
import axios from 'axios'; // Make sure axios is installed for making API requests


const Result = ({  questions, userAnswers, testName, marks, studentId, subject,testId , rollno,division}) => {
  const [score, setScore] = useState(0);
  let isCorrect=false;

  useEffect(() => {
  
 
    // Calculate score when questions or userAnswers change
    const calculatedScore = questions.reduce((acc, question) => {
      const userAnswer = userAnswers[question.id];

      if(userAnswer==question.correctAnswer){
         isCorrect=true;
      }
      else{
        isCorrect=false;
      }

      // Debugging the comparison
     
      return acc + (isCorrect ? 1 : 0);
    }, 0);
    
    setScore(calculatedScore);

    // sessionStorage.setItem(
    //         'userResult',
    //         JSON.stringify({
    //           studentId,
    //           testId,
    //           testName,
    //           score:score*(marks/10),
    //           maxMarks: marks,
    //  }));
    const updateStudentScore = async () => {
      try {
       const response= await axios.post('http://localhost:5000/api/resultupdate', {
          studentId,
          testId,
          testName,
          rollno,
          division,
          subject,
          score: score*(marks/10),
        });
        console.log("result data from result.jsx ",response.data);
        
        sessionStorage.setItem('score',score);
        sessionStorage.setItem('testName',testName);
        sessionStorage.setItem('subject',subject)
        console.log('Score updated successfully');
      } catch (error) {
        console.error('Error updating score:', error);
      }
    };
  
    if (score > 0) {  // Ensure score is calculated before sending the API request
      updateStudentScore();
    }
  
  }, [questions, userAnswers, marks,testName,score, studentId, testId]);
  
  //     // Call the backend to update the student's score


  return (
    <div className="results-container">
      <h2>Test Completed</h2>
      <p className="score">
        Your Score: <span>{score*(marks / 10)}</span> out of {marks}
      </p>
      <h3>Question Review:</h3>
      {questions.map((question) => (
        <div key={question.id} className="review-question">
          <p>
            <strong>{question.question}</strong>
          </p> 
          <p>
            Your Answer:{" "}
            {userAnswers[question.id] ? (
              <span
                className={
                  userAnswers[question.id] === question.correctAnswer
                    ? 'correct'
                    : 'incorrect'
                }
              >
                {userAnswers[question.id]}
              </span>
            ) : (
              "Not Answered"
            )}
          </p>
          <p>
            Correct Answer: <span className="correct">{question.correctAnswer}</span>
          </p>
          <hr className="review-separator" />
        </div>
      ))}
      {/* <ViewResults/> */}
    </div>
  );
};

export default Result;
