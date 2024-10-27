import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ViewResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch the student test results when the component mounts
  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const studentId = sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage
        const token = sessionStorage.getItem('authToken');  // Retrieve authToken if needed

        const response = await axios.get('http://localhost:5000/student/results', {
          params: { studentId },
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        });

        setTestResults(response.data); // Set the fetched test results
      } catch (error) {
        console.error('Error fetching test results:', error.message); 
        setMessage('Error fetching test results. Please try again.');
      }
    };

    fetchTestResults();
  }, []);

  return (
    <div style={{marginLeft:'10px'}} >
      <div className="container">
        <h2 className='my-2 mb-3'><strong className='text-success'>SCORE BOARD</strong></h2>
        {/* {message && <p>{message}</p>} */}
        {testResults.length > 0 ? (
          <table className="table" style={{width:'50vw'}}>
            <thead>
              <tr>
                <th style={{border:'1px solid black'}}>Test Name</th>
                <th style={{border:'1px solid black'}}>Subject</th>
                <th style={{border:'1px solid black'}}>Score</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => (
                <tr key={index}>
                  <td  style={{ border: "1px solid black", padding: "9px 25px" }}>{result.testName}</td>
                  <td  style={{ border: "1px solid black", padding: "9px 25px" }}>{result.subject}</td>
                  <td  style={{ border: "1px solid black", padding: "9px 25px" }}>{result.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='container' style={{height:'80px'}}>No test results available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewResults;
