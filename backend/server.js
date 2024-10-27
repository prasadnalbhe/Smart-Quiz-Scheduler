const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Teacher = require("./models/Teacher"); // Assuming Teacher model is defined in this file
const Student = require("./models/Student"); // Assuming Teacher model is defined in this file
const app = express();
const router = express.Router();
const PORT = 5000;
const ObjectId = mongoose.Types.ObjectId;

const { Schema } = mongoose;

// const   JWT_SECRET= your_jwt_secret; // Move to .env in real apps

// const Test = require('./models/Test'); // Assuming you have a Test model
// require('dotenv').config();
const env = require("dotenv"); 

env.config({ path: "./config.env" });

MONGODB_URI = "mongodb://localhost:27017/quizBuilderDB";

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/quizBuilderDB")
  .then(()=>console.log("connected to MONGODB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const studentsTakenSchema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  username: String,
  subject: String,
  rollno: String,
  division: String,
  score: Number,
});

// // Define your NewTest schema
// const newTestSchema = new mongoose.Schema({
//   metadata: Object,
//   data: Array,
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
//   studentsTaken: [studentsTakenSchema],
// });

// const TestData = mongoose.model("testdata", newTestSchema);

// // Endpoint to save test
// router.post("/api/testsdata", async (req, res) => {
//   const { metadata, data, teacher } = req.body;

//   const newTest = new TestData({ metadata, data, teacher });


//   try {
//     //test ddta is saved in testdatas section
//     const savedTest = await newTest.save(); // This returns the saved test including the _id
//     const testId = savedTest._id; // Get the ID of the newly saved test

//     // Find the teacher by ID
//     const teacherdata = await Teacher.findById(teacher);

//     if (!teacherdata) { 
//       return res.status(404).json({ message: "Teacher not found" });
//     }

//     // Add the new test ID to the teacher's tests array
//     teacherdata.tests.push({testId:testId});

//     // Save the updated teacher document
//     const savedteacher=await teacherdata.save();


//     // now we need to store test id into the teacher schema who created that test
  
//     res.status(201).send("Test saved successfully");
//   } catch (error) {
//     res.status(400).send("Error saving test: " + error.message);
//   }
// });

// Define your NewTest schema
const newTestSchema = new mongoose.Schema({
  metadata: Object,
  data: Array,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  studentsTaken: [studentsTakenSchema], // Assuming studentsTakenSchema is defined elsewhere
});

// Define the Test model
const TestData = mongoose.model("TestData", newTestSchema);

// Endpoint to save test
router.post("/api/testsdata", async (req, res) => {
  const { metadata, data, teacher } = req.body;

  // Check if required fields are present
  if (!metadata || !data || !teacher) {
    return res.status(400).json({ message: "Metadata, data, and teacher are required" });
  }

  try {
    // Create a new test document
    const newTest = new TestData({
      metadata,
      data,
      teacher,
    });

    // Save the test to the database
    const savedTest = await newTest.save();

    const testId = savedTest._id; // Get the newly saved test's ID

    // Find the teacher by ID
    const teacherData = await Teacher.findById(teacher);

    if (!teacherData) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Add the test ID to the teacher's tests array
    teacherData.tests.push(testId); // Push testId directly, no need for { testId: testId }

    // Save the updated teacher document
    await teacherData.save();

    res.status(201).json({ message: "Test saved successfully", testId });
  } catch (error) {
    console.error("Error saving test:", error);
    res.status(500).json({ message: "Error saving test: " + error.message });
  }
});


//

router.post("/api/signup", async (req, res) => {
  //  const { username, email, password,role } = req.body;
  const { username, email, password, role, rollno, division } = req.body;

  if (role == "teacher") {
    try {
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Create new teacher
      const newTeacher = new Teacher({
        id: Date.now(),
        username,
        email,
        password,
      });

      const savedTeacher = await newTeacher.save();

      // Generate token
      const token = jwt.sign({ id: savedTeacher._id}, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ token, teacher: savedTeacher, role });
    } catch (err) {
      console.error("Error during sign-up:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  if (role == "student") {
    try {
      const existingTeacher = await Student.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Create new student
      const newStudent = new Student({
        id: Date.now(),
        username,
        email,
        password,
        rollno,
        division,
      });

      const savedStudent = await newStudent.save();

      // Generate token
      const token = jwt.sign({ id: savedStudent._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ token, teacher: savedStudent, role });
    } catch (err) {
      console.error("Error during sign-up:", err);
      // res.status(500).json({ error: "Internal server error" });
    }
  }
  // Check if teacher already exists
});

// Login route
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user is a teacher
    let user = await Teacher.findOne({ email });
    let role = "teacher"; // Default role as teacher

    if (!user) {
      // If not a teacher, check if user is a student
      user = await Student.findOne({ email });
      role = "student"; // If found in students, set role as student
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Send token and role back to the client
    res.status(200).json({ token, role, username: user.username, rollno:user.rollno, division: user.division });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// Example of personalized teacher dashboard route
router.get("/api/teacher/dashboard", verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher); // Send personalized data
  } catch (err) {
    res.status(500).json({ error: "Error fetching teacher data" });
  }
});

app.get("/api/tests/:id", async (req, res) => {
  try {
    const test = await TestData.findById(req.params.id); // Fetch test by ID from MongoDB
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Error fetching test" });
  }
});

// Endpoint to retrieve all tests
router.get("/tests", async (req, res) => {
  const { teacherId } = req.query; // Get teacherId from query parameters

  try {
    // Retrieve tests where teacher matches the teacherId
    const tests = await TestData.find({ "teacher": teacherId });

    // Return the filtered tests
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests", error });
  }
});
 
 
 
// Endpoint to retrieve tests scheduled for a specific student
router.get("/student/tests", async (req, res) => {
  const { studentId } = req.query|| req.params || req.session.userId; // Get studentId from query parameters

  try {
    // Retrieve student details based on studentId
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get the student's class division (e.g., TY-A, TY-B, etc.)
    const studentDivision = student.division;


    // Get today's date in the format YYYY-MM-DD to compare with test dates
    const today = new Date().toISOString().split('T')[0];

    // Find tests where:
    // 1. The classLevel in metadata includes the student's class.
    // 2. The student has not already taken the test (studentsTaken.studentId).
    // 3. The testDate is today or in the future (metadata.testDate).
    const tests = await TestData.find({
      "metadata.classLevel": { $regex: studentDivision, $options: "i" }, // Match class division
      "studentsTaken.studentId": { $ne: studentId }, // Exclude tests already taken by student
      "metadata.testDate": { $gte: today } // Only include tests with dates today or in the future
    });

    res.status(200).json(tests); // Return the filtered tests
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests", error });
  }
});



// Endpoint to edit a test by ID
router.put("/api/tests/:id", async (req, res) => {
  const { id } = req.params;
  const { metadata, data } = req.body;

  try {
    const updatedTest = await TestData.findByIdAndUpdate(
      id,
      { metadata, data },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json(updatedTest);
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to delete a test by ID
router.delete("/api/tests/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTest = await TestData.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Node.js with Express - Example Route to Fetch Profile
app.get("/api/profile/:email", async (req, res) => {
  try {
    const email = req.params.email;
    let profile = await Student.findOne({ email }); // Assuming you're using MongoDB and Mongoose

    if (!profile) {
      profile = await Teacher.findOne({ email }); // Assuming you're using MongoDB and Mongoose
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to update profile (PUT method)
router.put("/api/profile", verifyToken, async (req, res) => {
  const { email, username, rollno, division } = req.body; // Assuming this structure
  try {
    let updatedProfile;

    // Check if the user is a teacher first
    let profile = await Teacher.findOne({ email });

    if (profile) {
      // If profile is found in Teacher collection, update Teacher profile
      updatedProfile = await Teacher.findOneAndUpdate(
        { email }, // Find the teacher by email
        { username, email }, // Fields to update
        { new: true } // Return the updated document
      );
    } else {
      // If not found in Teacher collection, check Student collection
      profile = await Student.findOne({ email });

      if (profile) {
        // Update Student profile
        updatedProfile = await Student.findOneAndUpdate(
          { email }, // Find the student by email
          { username, rollno, division, email }, // Fields to update
          { new: true } // Return the updated document
        );
      }
    }

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile); // Send updated profile back to client
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile: " + error.message });
  }
});

// Route to update student score after test completion
router.post("/api/resultupdate", async (req, res) => {
  const { studentId, testId, testName, rollno, division, subject, score } = req.body;


  try {
    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the test is already in the student's testsTaken array
    const testIndex = student.testsTaken.findIndex(
      (test) => test.testId.toString() === testId
    );
    // const testIndex = 0;
    if (testIndex !== -1) {
      // If the test is already there, update the score
      student.testsTaken[testIndex].testName = testName;
      student.testsTaken[testIndex].subject = subject;
      student.testsTaken[testIndex].score = score;
    } else {
      // If the test is not there, add it in key: value format
      student.testsTaken.push({ testId, testName, subject, score });
    }

    // Save the updated student document
    await student.save();

    // Now update the studentsTaken array in the testdatas collection
    const testData = await TestData.findOne({ _id: testId });


    if (testData) {
      // Check if the student is already in the studentsTaken array of testdatas collection
      const studentIndex = testData.studentsTaken.findIndex(
        (s) => s.studentId.toString() === studentId
      );

      if (studentIndex !== -1) {
        // If the student is already there, update the score
        testData.studentsTaken[studentIndex].studentId =
          new mongoose.Types.ObjectId(studentId);
        testData.studentsTaken[studentIndex].username = student.username;
        testData.studentsTaken[studentIndex].subject = subject;
        testData.studentsTaken[studentIndex].rollno=rollno;
        testData.studentsTaken[studentIndex].division=division;
        testData.studentsTaken[studentIndex].score = score;

      } else {
        // If the student is not there, add them in key: value format
        // Convert the studentId to an ObjectId
        testData.studentsTaken.push({
          studentId: new mongoose.Types.ObjectId(studentId), // Convert studentId to ObjectId
          username: student.username,
          subject,
          rollno,
          division,
          score,
        });
      }

      // Save the updated test data document
      await testData.save();
    } else {
      // If no test data is found, return an error
      return res.status(404).json({ message: "Test data not found" });
    }

    res.json({ message: "Score updated successfully", student });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/student/results", async (req, res) => {
  const { studentId } = req.query; // Get studentId from query parameters

  try {
    // Find student by studentId
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Initialize an array to store the test results with additional details
    let resultsWithSubjects = [];

    // Loop through the testsTaken array and fetch additional details like subject using testId
    for (let testTaken of student.testsTaken) {
      const testData = await TestData.findById(testTaken.testId); // Find test details by testId
      if (testData) {
        resultsWithSubjects.push({
          testName: testTaken.testName,
          subject: testData.metadata[0]?.subject, // Get subject from the test metadata
          score: testTaken.score,
        });
      }
    }

    // Return the test results with subjects
    res.status(200).json(resultsWithSubjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching test results", error });
  }
});


app.get('/teacher/viewresults', async (req, res) => {
  try {
    const { teacherId } = req.query;  // Use req.query instead of req.params

    
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required.' });
    }

    // Find all tests by this teacher
    const tests = await TestData.find({ teacher: teacherId }).populate('studentsTaken.studentId');
    

    if (!tests || tests.length === 0) {
      return res.status(404).json({ message: 'No tests found for this teacher.' });
    }

    // Structure the response
    const filteredTests = tests.map(test => {
      const { metadata, studentsTaken } = test;

      return {
        testName: metadata[0].testName,
        subject: metadata[0].subject,
        marks: metadata[0].marks,
        students: studentsTaken.map(student => ({
          studentName: student.username,
          rollno: student.rollno,
          division: student.division,
          score: student.score
        }))
      };
    });

    res.status(200).json(filteredTests);

  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Server error while fetching test results.' });
  }
});


app.use(router);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
