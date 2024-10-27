import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Css/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    rollno: '',
    division: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const decodeToken = (token) => {
    const payload = token.split('.')[1]; // Get the payload part of the token
    const decodedPayload = atob(payload); // Decode Base64
    return JSON.parse(decodedPayload); // Convert from JSON string to an object
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a copy of formData to modify before sending
    const dataToSend = { ...formData };

    // Remove unnecessary fields for teachers
    if (formData.role === 'teacher') {
      delete dataToSend.rollno;
      delete dataToSend.division;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', dataToSend);
      const { token, role } = response.data;


      const decodedToken = decodeToken(token);
      const userId = decodedToken.id;
      console.log("decoded userId from signup.jsx " ,userId)

      // Store token and user details in session storage
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userEmail', formData.email);
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('username', formData.username);
      sessionStorage.setItem('userId',userId);
      // Navigate to the respective dashboard with username
      const userName = formData.username;
      if (role === 'teacher') {
        navigate(`/teacher/profile`);
      } else {
        
        sessionStorage.setItem('rollno',formData.rollno);
        sessionStorage.setItem('division',formData.division);
        navigate(`/student/profile`);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="main-signup">
      <div className="signup-container">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="username"
            placeholder="Enter your Name"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />

          <div className="d-flex justify-content-between">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              style={{ width: '48%' }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
              style={{ width: '48%' }}
            />
          </div>

          {/* Conditionally render rollno and division for students */}
          {formData.role === 'student' && (
            <>
              <input
                type="text"
                name="rollno"
                placeholder="Enter your Roll Number"
                value={formData.rollno}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="text"
                name="division"
                placeholder="Enter your Division"
                value={formData.division}
                onChange={handleChange}
                className="form-input"
                required
              />
            </>
          )}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button type="submit" className="submit-button" style={{ backgroundColor: '#0a2966' }}>
            Signup
          </button>
          <p className="mx-2">Already have an account? <a className="mx-2" href="http://localhost:5173/login">Login</a></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
