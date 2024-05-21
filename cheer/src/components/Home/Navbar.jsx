import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import logo from "./logo.png";
import { Link, useLocation } from 'react-router-dom';
import GlobalContext from '../../context/GlobalContext';
const routerPath = `/api`;//beginning of routerPath for login
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; //using cors to connect the backend to the front end

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [email, setEmail] = useState(localStorage.getItem("email"));
  // const {setAccountTypeGlobal} = useContext(GlobalContext);
  const [accountType, setAccountType] = useState('');
  const location = useLocation();

  // keep user logged in after refreshing page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    else{
      setEmail('');
    }
  } ,[]);
  
  useEffect(() => {
    // runs when path is changed
    if(location.pathname === '/') {
      setIsLoggedIn(false);
    }
    else if(location.pathname === '/main'  || accountType !== ''){
      setIsLoggedIn(true);
      getUserType();
    }
  }, [location.pathname]);

  useEffect(() => {
    getUserType();
  }, []);

  const getUserType = () => {
    fetch(`${backendUrl}${routerPath}/login?email=${localStorage.getItem("email")}`,{
      headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
      }
  })
      .then(res => res.json()
      .then(data => {
            setAccountType(data.data);
            localStorage.setItem("Account-Type",data.data);
      })
      .catch((error) => {
          console.log(error + " error from login data retrieval");//error msg if there is an error when retrieving the data
          })
      )
      .catch((err)=>{//error msg if there is an error reading the json from the backend
          console.log(err)
      })
  }


  return (
    <>
      {isLoggedIn && <div className="nav-logo-container">
        <Link to="/main" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logo} alt="Ongoing Living & Learning Inc. Logo" style={{ width: '120px', height: 'auto' }} />
          <h1 className="nav-logo-title" style={{ color: '#F5F5E1' }}>O.L.L.I</h1>
        </Link>
      </div>}
       {!isLoggedIn && <div className="nav-logo-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logo} alt="Ongoing Living & Learning Inc. Logo" style={{ width: '120px', height: 'auto' }} />
          <h1 className="nav-logo-title" style={{ color: '#F5F5E1' }}>O.L.L.I <br/></h1>
        </Link>
      </div>}
      <nav className="nav-navbar">
        <ul className="nav-list">
          {!isLoggedIn && 
          <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
          }
          {isLoggedIn && 
          <>
          <li className="nav-item" onClick={() => {setIsLoggedIn(false); localStorage.removeItem('email'); localStorage.removeItem('Account-Type'); localStorage.removeItem('token');}}><Link to="/" className="nav-link">Logout</Link></li>
          <li className="nav-item"><Link to="/calendar" className="nav-link">Calendar</Link></li>
          </>
          }
          <li className="nav-item"><Link to="/contact" className="nav-link">Contact</Link></li>
          <li className="nav-item"><Link to="/newsletter" className="nav-link">Newsletter</Link></li>
          <li className="nav-item"><Link to="/about" className="nav-link">About Us</Link></li>
          <li className="nav-item"><Link to="/reviews" className ="nav-link">Leave a Review</Link></li>
          {accountType === 'Client' && isLoggedIn &&
          <>
            <li className="nav-item"><Link to="/chatbox" className="nav-link">Chatbox</Link></li>
            <li className="nav-item"><Link to="/downloadPDF" className="nav-link">Download files</Link></li>
            <li className="nav-item"><Link to="/UPloadPDF" className="nav-link">Upload files</Link></li>
            <li className="nav-item"><Link to="/fetchImages" className="nav-link">Display photos</Link></li>
          </>}
          {accountType === 'Admin' && isLoggedIn &&
          <>
            <li className="nav-item"><Link to="/pdfAccess" className="nav-link">View Files</Link></li>
            <li className="nav-item"><Link to="/pdfUploadAdmin" className="nav-link">Admin pdf upload</Link></li>
            <li className="nav-item"><Link to="/gallery" className="nav-link">Upload Photos</Link></li>
            <li className="nav-item"><Link to="/fetchImages" className="nav-link">Display photos</Link></li>
          </>
          }
        </ul>
      </nav>
    </>
  );
}

export default Navbar;