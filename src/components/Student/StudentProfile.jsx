import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Css/TeacherProfile.css'; // Import your CSS

function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    rollno: '',
    division: ''
  });

  // Fetch profile data from backend after login/signup
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = sessionStorage.getItem('authToken'); // Use the token stored after login/signup
        const userEmail = sessionStorage.getItem('userEmail'); // Get the user's email from session storage
        const username=sessionStorage.getItem('username');
        
        const response = await axios.get(`http://localhost:5000/api/profile/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token to authenticate request
          },
        });
        setFormData(response.data); // Update formData with fetched profile data
      } catch (error) {
        console.error('Error fetching student profile', error);
      }
    };
    fetchProfileData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save after editing profile
  // Handle save after editing profile
// Handle save after editing profile
const handleSaveClick = async () => {
  try {
    const token = sessionStorage.getItem('authToken');

    // Log to ensure token is available
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const updatedData = { ...formData };  // Assuming formData contains updated profile details

    // Send the PUT request to update the profile
    const response = await axios.put('http://localhost:5000/api/profile', updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });

    setIsEditing(false); // Exit editing mode after successful update
  } catch (error) {
    // Improved error handling to show the exact error message
    if (error.response) {
      console.error('Server error:', error.response.data.message || error.response.data);
    } else {
      console.error('Error saving student profile:', error.message);
    }
  }
};


  return (
    <div className="profile-container" style={{marginLeft:'10px'}}>
      <div className="profile-header">
        {isEditing ? (
          <label htmlFor="division"> Enter Name

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field my-2"
          />
          </label>
        ) : (
          <h2 className='my-3'>{formData.username.toUpperCase()}</h2>
        )}
        <p className='my-0'>Roll No : {formData.rollno}</p>
      </div>

      <div className="profile-info">
        <p>
          <strong>Division:</strong>{' '}
          {isEditing ? (
            <input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="input-field my-2 mb-3"
              />
          ) : (
            formData.division
          )}
        </p>
        
        <p className='d-flex flex-wrap'>
          <strong className='me-3'>Email:</strong>{    formData.email}
               
        </p>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSaveClick}>Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
