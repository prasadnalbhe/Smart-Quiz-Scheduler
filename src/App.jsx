import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";

import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import Signup from './components/Signup'; 
import Login from './components/Login'; 
import ErrorBoundary from './components/ErrorBoundary'; // Import your ErrorBoundary component
function App() {

 
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect based on user role     */}
              <Route
                path={`/teacher/*`}
                element={<TeacherDashboard />}
              />
              <Route
                path={`/student/*`}
                element={<StudentDashboard />}
              />

       

          {/* Optional: Redirect to Home if not logged in */}
          <Route path="*" element={<Login />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
