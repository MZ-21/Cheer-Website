import React, { useState, useEffect } from 'react';
import './MainPage.css';
import background from "../Home/cheergroup.png"
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const routerPath = `/api`; // Beginning of routerPath for login
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL using cors to connect the backend to the front end

const Home = () => {
    const [accountType, setAccountType] = useState('');
    const [userName, setUserName] = useState('');
    const [clientList, setClientList] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [clientData, setClientData] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [reviews, setReviews] = useState([]); 

    // Use effects
    useEffect(() => {
        getUserType();
        fetchClientList();
        fetchStaffList();
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
              const response = await axios.get(`${backendUrl}/api/reviews`);
              setReviews(response.data);
            } catch (error) {
              console.error('Error fetching reviews:', error);
            }
          };
          
        fetchReviews();
      }, []);

      const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
      };

    // Functions
    const getUserType = () => {
        fetch(`${backendUrl}${routerPath}/login?email=${email}`, {
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            }
        })
            .then(res => res.json()
                .then(data => {
                    setAccountType(data.data);
                    setUserName(data.username);
                })
                .catch((error) => {
                    console.log(error + " error from login data retrieval"); // Error message if there is an error when retrieving the data
                })
            )
            .catch((err) => { // Error message if there is an error reading the JSON from the backend
                console.log(err);
            });
    };

    const fetchClientList = async () => {
        try {
            const response = await fetch(`${backendUrl}${routerPath}/clientList`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setClientList(data.fullName);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const fetchStaffList = async () => {
      try {
          const response = await axios.get(`${backendUrl}${routerPath}/staffList`);
          console.log("Fetched staff list:", response.data); // Debug log
          const staffArray = Array.isArray(response.data.staff) ? response.data.staff : []; // Assuming staff data comes under a 'staff' key
          setStaffList(staffArray);
          console.log("Updated staff list state:", staffArray); // Debug log to confirm state update
      } catch (error) {
          console.error('Error fetching staff list:', error);
          setStaffList([]); // Reset staffList to an empty array in case of error
      }
    };
    
  

    const selectClient = (event) => {
        setSelectedClient(event.target.value);
    };

    const selectStaff = (event) => {
        setSelectedStaff(event.target.value);
    };

    const getClientInfo = () => {
        let client = selectedClient.split(" ");
        fetch(`${backendUrl}${routerPath}/clientInfo?firstName=${client[0]}&lastName=${client[1]}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json()
                .then(data => {
                    setClientData(data);
                    setVisibility(true);
                })
                .catch((error) => {
                    console.log(error + " error from login data retrieval"); // Error message if there is an error when retrieving the data
                })
            )
            .catch((err) => { // Error message if there is an error reading the JSON from the backend
                console.log(err);
            });
    };

    const generatePayStub = async () => {
        try {
          const url = `${backendUrl}/api/generate`;
          const response = await axios.post(url, { username: selectedStaff });
      
          if (response.data.url) {
            window.open(response.data.url, '_blank');
          } else {
            console.error('No URL provided for download');
          }
        } catch (error) {
          console.error('Error generating pay stub:', error);
          alert('Error generating pay stub. Please check console for details.');
        }
      };
      
      
      
    
  
  

    return (
        <div>
            {accountType === '' && <h1>Error: Not Logged In</h1>}
            <main>
                {accountType !== '' && (
                    <>
                        <h1>Welcome, {userName}!</h1>
                        <div className="main-container">
                            <div className="background-container">
                                <div className="background-image-container">
                                    <img src={background} alt="Background" />
                                </div>
                                <div className="content-container">
                                    <h2 className="subtitle">
                                        C.H.E.E.R Group
                                    </h2>
                                    <p className="main-paragraph">
                                        Social, recreation, leisure, and friendship program for young adults with intellectual disabilities.
                                    </p>
                                    <br />
                                    <br />
                                </div>
                            </div>
                        </div>
                        <div className="review-section">
                    <div className="review-slideshow">
                        <h2>User Reviews</h2>
                        <Slider {...settings}>
                            {reviews && reviews.map((review) => (
                                <div key={review._id}>
                                    <p>{review.reviewText}</p>
                                    <p>- {review.username || 'Anonymous'}</p>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div> 
                    </>
                )}
                {accountType === 'Admin' &&
                    <div>
                        <div className="main-container">
                            <div className='content-container'>
                                <h2 className='subtitle'>Access Client Info</h2>
                                <label htmlFor="client-select">Choose A Client:</label>
                                <select name='client-select' value={selectedClient} onChange={selectClient}>
                                    <option hidden></option>
                                    {clientList.map((client, index) => (
                                        <option key={index} value={client.name}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={getClientInfo}>Get Details</button>

                                {visibility && <div>
                                    <p>{'Medical Condition(s):'} {clientData.medicalCondition.length > 0 ? clientData.medicalCondition : 'none'}</p>
                                    <p>{'Allergy(s):'} {clientData.allergies.length > 0 ? clientData.allergies : 'none'}</p>
                                    <p>{'Extra Information:'} {clientData.extraInfo.length > 0 ? clientData.extraInfo : 'none'}</p>
                                </div>}
                            </div>
                        </div>
                        <div className="main-container">
                            <div className='content-container'>
                                <h2 className='subtitle'>Generate Pay Stub</h2>
                                <label htmlFor="staff-select">Choose A Staff Member:</label>
                                <select name='staff-select' value={selectedStaff} onChange={selectStaff}>
                                    <option hidden></option>
                                    {staffList.map((staff, index) => (
                                        <option key={index} value={staff.id}>{staff.name} </option>
                                    ))}
                                </select>
                                <button onClick={generatePayStub}>Generate Pay Stub</button>
                            </div>
                        </div>
                    </div>
                }
            </main>
            <footer>
                <p>&copy; 2024 Ongoing Living & Learning Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
