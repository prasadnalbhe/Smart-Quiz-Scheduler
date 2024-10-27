// import React, { useState } from "react";
// import { saveAs } from "file-saver";
// import "./TextEditor.css"; // Import the CSS file
// import axios from "axios";

// const TextEditor = () => {
//   const [text, setText] = useState("");
//   const [fileName, setFileName] = useState("");
//   const [showModal, setShowModal] = useState(false); // For showing the popup form
//   const [showScheduleConfirmation, setShowScheduleConfirmation] =
//     useState(false); // For scheduling confirmation
//   const [title, setTitle] = useState("");
//   const [hasTimer, setHasTimer] = useState(false); // Switch for timer
//   const [duration, setDuration] = useState(""); // Timer input when enabled

//   const handleTextChange = (e) => setText(e.target.value);
//   const handleFileNameChange = (e) => setFileName(e.target.value);
//   const handleTitleChange = (e) => setTitle(e.target.value);
//   const handleDurationChange = (e) => setDuration(e.target.value);

//   //    now  creating test form for storing test information
//   const [formData, setFormData] = useState({
//     testName: "", // Change 'testName' to 'name'
//     subject: "",
//     classLevel: "", // Change 'classLevel' to 'class'
//     marks: "",
//     testDate: "",
//     testTime: "", // Change 'testTime' to 'time'
//     duration: "",
//   });

//   // handle change from createtest.jsx
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const openFile = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => setText(event.target.result);
//     reader.readAsText(file);
//   };
//   // Function to handle scheduling
//   const scheduleTest = async () => {
//     // Display confirmation popup
//     setShowScheduleConfirmation(true);
//   };

//   const confirmSchedule = async () => {
//     const lines = text.split("\n");
//     let questions = [];
//     let currentQuestion = null;
//     let options = [];

//     lines.forEach((line) => {
//       const trimmedLine = line.trim();

//       if (trimmedLine.startsWith("Q.")) {
//         if (currentQuestion) {

//           const questionImage = imageFiles.length > 0 ? imageFiles[0] : null; // Adjust logic as needed

//           const correctAnswers = options
//             .filter((opt) => opt.startsWith("*"))
//             .map((opt) => opt.substring(3).trim());
//           const questionType =
//             correctAnswers.length > 1 ? "Multi_choice" : "Single_choice";

//           questions.push({
//             id: questions.length + 1,
//             question: currentQuestion,
//             options: options.map((opt) =>
//               opt.startsWith("*")
//                 ? opt.substring(3).trim()
//                 : opt.substring(3).trim()
//             ),
//             correctAnswer: correctAnswers,
//             questionType: questionType,

//             image: questionImage ? URL.createObjectURL(questionImage) : null, // Include image

//           });
//         }
//         currentQuestion = trimmedLine.substring(3).trim();
//         options = [];
//       } else if (trimmedLine) {
//         options.push(trimmedLine);
//       }
//     });

//     if (currentQuestion) {
//       const questionImage = imageFiles.length > 0 ? imageFiles[0] : null; // Adjust logic as needed

//       const correctAnswers = options
//         .filter((opt) => opt.startsWith("*"))
//         .map((opt) => opt.substring(3).trim());
//       const questionType =
//         correctAnswers.length > 1 ? "Multi_choice" : "Single_choice";

//       questions.push({
//         id: questions.length + 1,
//         question: currentQuestion,
//         options: options.map((opt) =>
//           opt.startsWith("*")
//             ? opt.substring(3).trim()
//             : opt.substring(3).trim()
//         ),
//         correctAnswer: correctAnswers,
//         questionType: questionType,

//         image: questionImage ? URL.createObjectURL(questionImage) : null, // Include image
//       });
//     }

//     console.log("Questions Array: ", questions); // Debugging line to check

//     const metadata = {
//       testName: formData.testName,
//       subject: formData.subject,
//       classLevel: formData.classLevel,
//       marks: formData.marks,
//       testDate: formData.testDate,
//       testTime: formData.testTime,
//       duration: formData.duration,
//     };

//     console.log("metadata is ", metadata);
//     const jsonContent = {
//       metadata: [metadata],
//       data: questions,
//       teacher: sessionStorage.getItem("userId"),
//     };

//     console.log("json content is ", jsonContent);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/testsdata",
//         jsonContent,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("response data from texteditor : ", response.data);
//       // if (response.status !== 200) {
//       //   throw new Error("Failed to save the test.");
//       // }

//       alert("Test scheduled successfully!");
//       setShowScheduleConfirmation(false); // Close confirmation popup
//       setText(""); // Clear text area
//       setFileName(""); // Clear filename
//       setTitle(""); // Clear title
//       setDuration(""); // Clear duration
//       setHasTimer(false); // Reset timer switch
//       setFormData({
//         testName: "",
//         subject: "",
//         classLevel: "",
//         marks: "",
//         testDate: "",
//         testTime: "",
//         duration: "",
//       });
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const cancelSchedule = () => {
//     setShowScheduleConfirmation(false);
//   };

//   return (
//     <div className="main-container">
//       {/* Navbar */}
//       <div className="container ">
//         <nav className="navbar">

//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageUpload}
//             style={{ display: "block", margin: "10px 0" }}
//           />
//           <div>
//             {imageFiles.map((file, index) => (
//               <div key={index}>
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt={`Uploaded Image ${index + 1}`}
//                   width="100"
//                 />
//                 <p>{file.name}</p>
//               </div>
//             ))}
//           </div>

//           <label htmlFor="file-upload" className="label">
//             Open File
//             <input
//               id="file-upload"
//               type="file"
//               onChange={openFile}
//               style={{ display: "none" }}
//             />
//           </label>
//           <button className="savebutton" onClick={scheduleTest}>
//             <strong style={{ color: "white" }}>Schedule</strong>
//           </button>
//         </nav>

//         {/* Textarea */}
//         <div className="textContainer">
//           <textarea
//             value={text}
//             onChange={handleTextChange}
//             placeholder="Type or paste your questions here..."
//             className="textarea"
//           />
//         </div>

//         {/* Popup Modal for saving JSON */}
//         {showModal && (
//           <div className="modalOverlay">
//             <div className="modalContent">
//               <h2>Metadata Information</h2>
//               <label>Title:</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={handleTitleChange}
//                 placeholder="Enter title"
//                 className="modalInput"
//               />
//               <div className="switchContainer">
//                 <label>Enable Timer:</label>
//                 <label className="switch">
//                   <input
//                     type="checkbox"
//                     checked={hasTimer}
//                     onChange={() => setHasTimer(!hasTimer)}
//                   />
//                   <span className="slider round"></span>
//                 </label>
//               </div>
//               {hasTimer && (
//                 <>
//                   <label>Duration (in minutes):</label>
//                   <input
//                     type="text"
//                     value={duration}
//                     onChange={handleDurationChange}
//                     placeholder="Enter duration"
//                     className="modalInput"
//                   />
//                 </>
//               )}
//               <button onClick={saveAsJson} className="modalButton">
//                 Save as JSON
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="modalButton"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Confirmation Popup for Scheduling */}
//         {showScheduleConfirmation && (
//           <div className="modalOverlay">
//             <div className="modalContent" style={{ width: "500px" }}>
//               {/* form from create test.jsx */}
//               <div className="container">
//                 <h2>Create a Test</h2>

//                 <form>
//                   <div className="d-flex">
//                     <div className="mx-3">
//                       <label>Test Name:</label>
//                       <input
//                         type="text"
//                         name="testName"
//                         value={formData.testName}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label>Subject:</label>
//                       <input
//                         type="text"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="d-flex">
//                     <div className="mx-3">
//                       <label>Class:</label>
//                       <input
//                         type="text"
//                         name="classLevel"
//                         value={formData.classLevel}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label>Marks:</label>
//                       <input
//                         type="number"
//                         name="marks"
//                         value={formData.marks}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="d-flex">
//                     <div className="mx-3">
//                       <label>Test Date:</label>
//                       <input
//                         type="date"
//                         name="testDate"
//                         value={formData.testDate}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label>Test Time:</label>
//                       <input
//                         type="time"
//                         name="testTime"
//                         value={formData.testTime}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label>Duration (minutes):</label>
//                     <input
//                       type="number"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   {/* <button type="submit">Next</button>  */}
//                 </form>
//               </div>

//               <h2>Schedule Confirmation</h2>
//               <p>Are you sure you want to schedule this test?</p>
//               <button onClick={confirmSchedule} className="modalButton">
//                 Confirm
//               </button>
//               <button onClick={cancelSchedule} className="modalButton">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TextEditor;

import React, { useState } from "react";
import { saveAs } from "file-saver";
import "./TextEditor.css"; // Import the CSS file
import axios from "axios";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [showModal, setShowModal] = useState(false); // For showing the popup form
  const [showScheduleConfirmation, setShowScheduleConfirmation] =
    useState(false); // For scheduling confirmation
  const [title, setTitle] = useState("");
  const [hasTimer, setHasTimer] = useState(false); // Switch for timer
  const [duration, setDuration] = useState(""); // Timer input when enabled

  const handleTextChange = (e) => setText(e.target.value);
  const handleFileNameChange = (e) => setFileName(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDurationChange = (e) => setDuration(e.target.value);

  // State for handling test form
  const [formData, setFormData] = useState({
    testName: "",
    subject: "",
    classLevel: "",
    marks: "",
    testDate: "",
    testTime: "",
    duration: "",
  });

  const [imageFiles, setImageFiles] = useState([]); // For storing image uploads

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files); // Add images to the array
  };

  const openFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => setText(event.target.result);
    reader.readAsText(file);
  };

  // Function to handle scheduling
  const scheduleTest = async () => {
    setShowScheduleConfirmation(true);
  };

  const confirmSchedule = async () => {
    const lines = text.split("\n");
    let questions = [];
    let currentQuestion = null;
    let options = [];
    let imageIndex = 0; // To track which image to assign to the question

    // Parse text for questions and answers
    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("Q.")) {
        if (currentQuestion) {
          const correctAnswers = options
            .filter((opt) => opt.startsWith("*"))
            .map((opt) => opt.substring(3).trim());
          const questionType =
            correctAnswers.length > 1 ? "Multi_choice" : "Single_choice";

          questions.push({
            id: questions.length + 1,
            question: currentQuestion,
            options: options.map((opt) =>
              opt.startsWith("*")
                ? opt.substring(3).trim()
                : opt.substring(3).trim()
            ),
            correctAnswer: correctAnswers,
            questionType: questionType,
            // Assign images to the first 'n' questions, where 'n' is the number of images uploaded
            image:
              imageFiles.length > 0 && imageIndex < imageFiles.length
                ? URL.createObjectURL(imageFiles[imageIndex++])
                : null, // Only assign image to questions if there are images left
          });
        }
        currentQuestion = trimmedLine.substring(3).trim();
        options = [];
      } else if (trimmedLine) {
        options.push(trimmedLine);
      }
    });

    // If there's a final question after the loop
    if (currentQuestion) {
      const correctAnswers = options
        .filter((opt) => opt.startsWith("*"))
        .map((opt) => opt.substring(3).trim());
      const questionType =
        correctAnswers.length > 1 ? "Multi_choice" : "Single_choice";

      questions.push({
        id: questions.length + 1,
        question: currentQuestion,
        options: options.map((opt) =>
          opt.startsWith("*")
            ? opt.substring(3).trim()
            : opt.substring(3).trim()
        ),
        correctAnswer: correctAnswers,
        questionType: questionType,
        image:
          imageFiles.length > 0 && imageIndex < imageFiles.length
            ? URL.createObjectURL(imageFiles[imageIndex++])
            : null,
      });
    }

    // Test metadata
    const metadata = {
      testName: formData.testName,
      subject: formData.subject,
      classLevel: formData.classLevel,
      marks: formData.marks,
      testDate: formData.testDate,
      testTime: formData.testTime,
      duration: formData.duration,
    };

    // Prepare JSON data to send to backend
    const jsonContent = {
      metadata: [metadata],
      data: questions,
      teacher: sessionStorage.getItem("userId"), // Fetch the logged-in teacher's ID
    };

    try {
      // Send test data to backend
      const response = await axios.post(
        "http://localhost:5000/api/testsdata",
        jsonContent,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowScheduleConfirmation(false); // Close confirmation popup
      setText(""); // Clear text area
      setFileName(""); // Clear filename
      setTitle(""); // Clear title
      setDuration(""); // Clear duration
      setHasTimer(false); // Reset timer switch
      setFormData({
        testName: "",
        subject: "",
        classLevel: "",
        marks: "",
        testDate: "",
        testTime: "",
        duration: "",
      });
      setImageFiles([]);
    } catch (error) {
      alert("Error scheduling test: " + error.message);
    }
  };

  const cancelSchedule = () => {
    setShowScheduleConfirmation(false);
  };

  // Function to delete an image
  const handleDeleteImage = (index) => {
    const updatedImages = [...imageFiles];
    updatedImages.splice(index, 1); // Remove the selected image
    setImageFiles(updatedImages); // Update the state with the remaining images

    // Reset the file input element's value to refresh the count
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = ""; // Reset the input value
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <nav className="navbar">
          <label htmlFor="file-upload" className="label">
            Open File
            <input
              id="file-upload"
              type="file"
              onChange={openFile}
              style={{ display: "none" }}
            />
          </label>

          <label
            htmlFor="image-upload"
            className="labelimage"
            style={{ marginLeft: "10px" }}
          >
            Upload Image
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{
                display: "none",
              }}
            />
          </label>

          <button className="savebutton" onClick={scheduleTest}>
            <strong style={{ color: "white" }}>Schedule</strong>
          </button>
        </nav>

        <div
          className="imageupload"
          style={{ border: "1px solid white", borderRadius: "20px" }}
        >
          <div className="d-flex flex-wrap">
            {imageFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#7C93C3",
                  padding: "10px",
                  borderRadius: "10px",
                  margin: "5px 5px",
                  position: "relative",
                }}
              >
                {/* Image Display */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded Image ${index + 1}`}
                  width="100"
                  style={{ borderRadius: "10px", backgroundColor: "black" }}
                />
                <p style={{ color: "white" }}>{file.name}</p>

                {/* Delete Button (Cross icon) */}
                <button
                  onClick={() => handleDeleteImage(index)}
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="textContainer" style={{ marginTop: "20px" }}>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Type or paste your questions here..."
            className="textarea"
          />
        </div>

        {showScheduleConfirmation && (
          <div className="modalOverlay">
            <div
              className="modalContent"
              style={{ width: "500px", height: "90vh" }}
            >
              <div className="container">
                <h2 className=" mb-4">Create a Test</h2>
                <form>
                  <div className="d-flex">
                    <div className="mx-3">
                      <label className="mb-2">Test Name:</label>
                      <input
                        type="text"
                        name="testName"
                        value={formData.testName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mx-3">
                      <label className="mb-2">Subject:</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="mx-3">
                      <label className="mb-2">Class:</label>
                      <input
                        type="text"
                        name="classLevel"
                        value={formData.classLevel}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mx-3">
                      <label className="mb-2">Total Marks:</label>
                      <input
                        type="number"
                        name="marks"
                        value={formData.marks}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="mx-3">
                      <label className="mb-2">Test Date:</label>
                      <input
                        type="date"
                        name="testDate"
                        value={formData.testDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mx-3">
                      <label className="mb-2">Test Time:</label>
                      <input
                        type="time"
                        name="testTime"
                        value={formData.testTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="mx-3 my-2">
                      <label className="mb-2">Duration (in minutes):</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </form>
                <div className="btn-group my-3">
                  <button onClick={confirmSchedule}>Confirm</button>
                  <button onClick={cancelSchedule}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
