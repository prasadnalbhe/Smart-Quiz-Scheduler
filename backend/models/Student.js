

const mongoose = require('mongoose');
const bcrypt = require('bcrypt')





const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollno: { type: String, required: true },
  division: { type: String, required: true }, // Class level they belong to
  testsTaken: [
    {
      testId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestData' },
      testName: { type: String }, // Added testName field
      score: { type: Number }, // Score achieved by the student
    },
  ], // List of tests taken with scores and timestamps
});


// // Before saving the teacher, hash the password
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// // Method to compare password during login
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('Student', studentSchema);
