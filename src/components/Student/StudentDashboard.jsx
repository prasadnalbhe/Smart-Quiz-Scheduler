import { Link, Routes, Route, Navigate ,useNavigate} from 'react-router-dom';
import TakeTest from './TakeTest';
import ViewResults from './ViewResults';
import StudentProfile from './StudentProfile';
// Import other components as needed
// import '../Css/CreateTest.css'; // Import your CSS here
// import "./TestHome.css";


const StudentDashboard = () => {
  
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Clear session storage or local storage
    sessionStorage.clear(); // Clear session storage
    // Navigate to login page
    navigate('/login'); 
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: '#2c3e50', color: 'white', padding: '20px' ,position:'fixed',height:'100vh'}}>

        <ul className='mx-3' style={{ listStyleType: 'none', padding: 0 }}>
        <li>
            
          <Link to="profile" style={linkStyle}>
            <h5 style={{display: 'flex', alignItems : 'center'}}>
              <svg  xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
            
              <span className='mx-3'>Profile </span></h5>       
          
            </Link>
          </li>


          <li>
            <Link to="take-test" style={{...linkStyle, fontSize:'18px'}}>Tests</Link>
          </li>
          <li>
            <Link to="view-results" style={{...linkStyle, fontSize:'18px'}}>View Results</Link>
          </li>
          <li >
            {/* Logout Button */}
            <button onClick={handleLogout} style={{ ...linkStyle, marginTop:'410px', background: 'transparent', border: 'none', cursor: 'pointer',textAlign:'start', fontSize:'20px'}}>
              Logout
            </button>
          </li>
          {/* Add more sidebar options */}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '10px 20px',marginLeft:'200px' }}>
        <Routes>
          <Route path="profile" element={<StudentProfile />} />

          <Route path="take-test" element={<TakeTest />} />
          <Route path="view-results" element={<ViewResults />} />
          <Route path="/" element={<Navigate to="profile" />} />
          {/* Add more nested routes */}
        </Routes>
      </div>
    </div>
  );
};

const linkStyle = {
  display: 'block',
  color: 'white',
  textDecoration: 'none',
  padding: '10px 0',
  fontSize: '1rem',
};

export default StudentDashboard;