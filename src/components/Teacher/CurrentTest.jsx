import React, { useEffect, useState } from "react";
import axios from "axios";
import './CurrentTest.css'
const CurrentTest = () => {
  const [tests, setTests] = useState([]);
  const [editingTest, setEditingTest] = useState(null);
  const [updatedTestData, setUpdatedTestData] = useState({
    testName: "",
    subject: "",
    classLevel: "",
    marks: "",
    duration: "",
    testTime: "",
    testDate: "",
  });

  // Fetch tests from the MongoDB database when the component mounts
  useEffect(() => {
    const fetchTests = async () => {
      const teacherId = sessionStorage.getItem("userId");

      if (!teacherId) {
        console.error("Teacher ID not found in session storage");
        // You can redirect the user or show an error message
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:5000/tests", {
          params: { teacherId }
        });
        setTests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  // Handle deleting a test
  const deleteTest = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tests/${id}`);
      setTests(tests.filter((test) => test._id !== id)); // Update state to remove deleted test
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  // Handle editing a test (show form with current test data)
  const handleEdit = (test) => {
    setEditingTest(test._id); // Set the test to be edited
    setUpdatedTestData({
      testName: test.metadata[0]?.testName,
      subject: test.metadata[0]?.subject,
      classLevel: test.metadata[0]?.classLevel,
      marks: test.metadata[0]?.marks,
      duration: test.metadata[0]?.duration,
      testTime: test.metadata[0]?.testTime,
      testDate: test.metadata[0]?.testDate,
    });
  };

  // Handle form submission to update the test
  const handleUpdate = async (e) => {
    e.preventDefault();  
    try {
      await axios.put(`http://localhost:5000/api/tests/${editingTest}`, {
        metadata: [updatedTestData],
      }); // Replace with your PUT API route
      // Update state to reflect changes
      setTests(
        tests.map((test) =>
          test._id === editingTest
            ? { ...test, metadata: [updatedTestData] }
            : test
        )
      );
      setEditingTest(null); // Close the edit form
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  // Handle input change for the edit form
  const handleInputChange = (e) => {
    setUpdatedTestData({ ...updatedTestData, [e.target.name]: e.target.value });
  };
 
  return (
    <div className="outer-container" style={{ width: "52vw",height:'100vh', overflow:"auto"}}>

      {tests.length > 0 ? (

        <ul style={{ listStyleType: "none", padding: "0 6px" }}>

          {tests.map((test) => (

            <li key={test._id}>

              {editingTest === test._id ? (
                // Edit form
                <div className="container mb-3" style={{width:'50vw'}}>

                <form onSubmit={handleUpdate}>
                  <div className="d-flex gap-3">
                    <label htmlFor="testName">
                      Name :
                      <input
                        type="text"
                        name="testName"
                        value={updatedTestData.testName}
                        onChange={handleInputChange}
                        placeholder="Test Name"
                      />
                    </label>
                    <label htmlFor="subject">
                      Subject :
                      <input
                        type="text"
                        name="subject"
                        value={updatedTestData.subject}
                        onChange={handleInputChange}
                        placeholder="Subject"
                      />
                    </label>
                  </div>

                  <div className="d-flex gap-3">
                    <label htmlFor="classLevel">
                      Class :
                      <input
                        type="text"
                        name="classLevel"
                        value={updatedTestData.classLevel}
                        onChange={handleInputChange}
                        placeholder="Class Level"
                      />
                    </label>
                    <label htmlFor="marks">
                      Marks :
                      <input
                        type="text"
                        name="marks"
                        value={updatedTestData.marks}
                        onChange={handleInputChange}
                        placeholder="Marks"
                      />
                    </label>
                  </div>
                  <div className="d-flex gap-3">
                    <label htmlFor="duraton">
                      Duration :
                      <input
                        type="text"
                        name="duration"
                        value={updatedTestData.duration}
                        onChange={handleInputChange}
                        placeholder="Duration"
                      />
                    </label>
                    <label htmlFor="testTime">
                      Time :
                      <input
                        type="text"
                        name="testTime"
                        value={updatedTestData.testTime}
                        onChange={handleInputChange}
                        placeholder="Test Time"
                      />
                    </label>
                  </div>
                  <label htmlFor="testDate">
                    Date :
                    <input
                      type="text"
                      name="testDate"
                      value={updatedTestData.testDate}
                      onChange={handleInputChange}
                      placeholder="Test Date"
                    />
                  </label>
                  <div className="d-flex gap-3">
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setEditingTest(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
                </div>

              ) : (
                // Display test data
                <div className="container mb-3" style={{ cursor: "pointer", width:'50vw'}}>
                  <div className="d-flex justify-content-between">
                    <h3>
                      <span className="me-2">
                        {" "}
                        {test.metadata[0]?.testName}
                      </span>
                      |<span className="mx-2">{test.metadata[0]?.subject}</span>
                    </h3>
                    <p>
                      <strong> Marks : {test.metadata[0]?.marks} </strong>
                    </p>
                  </div>
                  <div className="d-flex  justify-content-between">
                    <p>
                      <span>Class:</span> {test.metadata[0]?.classLevel}
                    </p>
                    <p>
                      <span>Duration:</span> {test.metadata[0]?.duration}{" "}
                      minutes
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>
                      <span>Date:</span> {test.metadata[0]?.testDate}
                    </p>
                    <p>
                      <span>Time:</span> {test.metadata[0]?.testTime}
                    </p>
                  </div>
                  {/* Edit and Delete buttons */}
                  <div className="d-flex justify-content-between">
                    <button onClick={() => handleEdit(test)}>Edit</button>
                    <button onClick={() => deleteTest(test._id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="container"style={{height:'80px'}}>No tests scheduled yet.</p>
      )}
    </div>
  );
};

export default CurrentTest;
