import React, { useEffect, useState } from "react";
import axios from "axios";
import Test from "../Teacher/Test creation/components2/Test";
import '../Css/TakeTest.css'

const TakeTest = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null); // For storing selected test data
  const [isTestAvailable, setIsTestAvailable] = useState(false); // To check if the test is available

  // Fetch tests from the MongoDB database when the component mounts
  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Retrieve studentId from sessionStorage
        const studentId = sessionStorage.getItem("userId");
  

        if (!studentId) {
          console.error("Student ID not found in session storage");
          return; // You can redirect or show an error message
        }
  
        // Fetch tests that match the student's class division
        const response = await axios.get("http://localhost:5000/student/tests", {
          params: { studentId: studentId } // Send studentId as a query parameter
        });
  
        setTests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);

  // Handle clicking on a test to attempt it
  const handleTestClick = async (test) => {
    const currentDate = new Date();
    const scheduledDate = new Date(test.metadata[0].testDate);
    // const testId= test._id;
    
    const scheduledTime = test.metadata[0].testTime.split(":");
    scheduledDate.setHours(scheduledTime[0], scheduledTime[1]);

    // Add 1 hour to the scheduled time
    const scheduledEndDate = new Date(scheduledDate);
    scheduledEndDate.setHours(scheduledEndDate.getHours() + 1);

    if (currentDate >= scheduledDate && currentDate <= scheduledEndDate) {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${test._id}`);
        setSelectedTest(response.data); // Fetch test data (JSON format) from MongoDB
        setIsTestAvailable(true); // Mark the test as available
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    } else if (currentDate < scheduledDate) {
      setIsTestAvailable(false); // Test not available yet
      alert("This test is not available until the scheduled date and time.");
    } else {
      setIsTestAvailable(false); // Test is no longer available after 1 hour
      alert("This test is no longer available.");
    }
  };
  const handleTestCompleted = (result) => {
    // You can add further logic, such as updating the state or navigating to a different page
  };

  const handleBackToTests = () => {
    setSelectedTest(null); // Go back to the test list
  };

  return (
    <div className="outer-container" style={{ minMidth: "300px",maxWidth:'700px',marginLeft:'7px', height:"100vh", overflow:'scroll-y' }}>
      {!selectedTest ? (
        <>
          {tests.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: "0 6px" }}>
              {tests.map((test) => (
                <li key={test._id}>
                  <div
                    className="container "
                    style={{ cursor: "pointer",width:'50vw', backgroundColor:'white',marginBottom:'20px'}}
                    onClick={() => handleTestClick(test)} // Trigger test click
                  >

                    <div className="d-flex justify-content-between" >

                    <div className="d-flex flex-column">
                      <h4>
                        <span className="me-2">{test.metadata[0]?.testName}</span> |
                        <span className="mx-3">{test.metadata[0]?.subject}</span>

                      </h4>
                      <p><span>Class:</span> {test.metadata[0]?.classLevel}</p>
                      <p><span>Date:</span> {test.metadata[0]?.testDate}</p>

                    </div>
                    <div className="d-flex flex-column">
              

                    <h5 className="text-success"><strong> Marks : {test.metadata[0]?.marks} </strong></h5>
                    <p><span>Duration:</span> {test.metadata[0]?.duration} minutes</p>
                    <p><span>Time:</span> {test.metadata[0]?.testTime}</p>
                    </div>

                    </div>


                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="container" style={{width:'40vw',height:'90px'}}>No tests scheduled yet.</p>
          )}
        </>
      ) : (
        <div>
          {isTestAvailable ? (
            // <TestHome testData={selectedTest} />
            <Test testData={selectedTest} onTestCompleted={handleTestCompleted} />

          ) : (
            <p>The test is not available right now.</p>
          )}

          <div className="d-flex justify-self-auto">

          <button onClick={handleBackToTests} className="ms-auto" style={{width:'40%', marginTop:'20px'}}>Back to Test List</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTest;
