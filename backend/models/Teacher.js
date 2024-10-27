const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const teacherSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tests: [{ testId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestData'} },
  ], // Reference to TestData schema
});


// // Before saving the teacher, hash the password
teacherSchema.pre('save', async function(next) {
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
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('Teacher', teacherSchema);
