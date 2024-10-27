const mongoose = require('mongoose');

const testDataSchema = new mongoose.Schema({
  metadata: {
    testName: { type: String, required: true },
    testTime: { type: String, required: true },
    testDuration: { type: String, required: true },
    testDate: { type: Date, required: true },
    classLevel: { type: String, required: true }, // Class level for which this test is created
    marks: { type: Number, required: true },
    subject: { type: String, required: true },
  },
  data: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    },
  ],
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // Reference to the teacher who created the test
  studentsTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // List of students who took this test
});

module.exports = mongoose.model('TestData', testDataSchema);
