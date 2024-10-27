import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import '../Css/TeacherProfile.css'; // Styling

function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: 'Prasad Nalbhe',
    email: 'nalbheprasad@gmail.com',
  });

  // Fetch profile data from backend on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = sessionStorage.getItem('authToken'); // Use the token stored after login/signup
        const userEmail = sessionStorage.getItem('userEmail'); // Get the user's email from session storage
        const username=sessionStorage.getItem('username');
        const response = await axios.get(`http://localhost:5000/api/profile/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching teacher profile', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
 // Log to ensure token is available
 if (!token) {
  console.error('No authentication token found');
  return;
}
      const updatedData = { ...formData }; // Modify as needed

      const response = await axios.put('http://localhost:5000/api/profile', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        },
      });
      setIsEditing(false);

    } catch (error) {
      console.error('Error saving teacher profile', error);

      if (error.response) {
        console.error('Server error:', error.response.data.message || error.response.data);
      } else {
        console.error('Error saving student profile:', error.message);
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
      
        {isEditing ? (
          <>
           
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
            />
          </>
        ) : (
          <>
            <h2>{formData.username}</h2>
          </>
        )}
      </div>

      <div className="profile-info">
       
        <p>
          <strong>Email:</strong>{' '}
          {isEditing ? (
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          ) : (
            formData.email
          )}
        </p>
       
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSaveClick}>
              Save
            </button>
            <button className="cancel-btn" onClick={handleCancelClick}>
              Cancel
            </button>
          </>
        ) : (
          <button className="edit-btn" onClick={handleEditClick}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default TeacherProfile;
