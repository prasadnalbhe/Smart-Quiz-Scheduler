import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Css/Login.css';
import { compareSync } from 'bcryptjs';






function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State for error message
  const navigate = useNavigate();


  
const decodeToken = (token) => {
  const payload = token.split('.')[1]; // Get the payload part of the token
  const decodedPayload = atob(payload); // Decode Base64
  return JSON.parse(decodedPayload); // Convert from JSON string to an object
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token, role, username, rollno, division } = response.data;
      console.log("token from login.jsx ",token);

      // Clear the error message on successful login
      setErrorMessage('');
      const decodedToken = decodeToken(token);
      const userId = decodedToken.id;
      console.log("decoded userId from Login.jsx " ,userId)

      // Store token and user details in session storage
  
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('rollno',rollno);
      sessionStorage.setItem('division',division);
      // Get username from email and navigate to personalized dashboard
      // const userName = email.split('@')[0];
      sessionStorage.setItem('username',username);
      if (role === 'teacher') {
        navigate(`/teacher/profile`);
      } else {
        navigate(`/student/profile`);
      }
    } catch (error) {
      console.error('Login error:', error);

      // Set the error message based on the response (assuming status 401 for incorrect password)
      if (error.response && error.response.status === 401) {
        setErrorMessage('Incorrect Password');
      } else {
        setErrorMessage('Incorrect Password, Please try again.');
      }
    }
  };

  return (
    <div className="outer-login">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>{
              setPassword(e.target.value);
              setErrorMessage('');
            }}
            required
            className="form-input"
          />
          {errorMessage && <p style={{ color: 'red'  }} >{errorMessage}</p>} {/* Error message */}
          <button type="submit" className="submit-button">Login</button>
          <p className="mx-2">Don't have an account? <a className="mx-2" href="http://localhost:5173/signup">Signup</a></p>
        </form>
      </div>
    </div>
  );
}

export default Login;
