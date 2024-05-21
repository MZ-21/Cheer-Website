import React from 'react';
import { useState, useEffect } from 'react';
import './clock.css';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const routerPath = `/api`; // beginning of routerPath for login
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL //using cors to connect the backend to the front end


const Clock = () => {
    // Use States
    const [isLoggedIn, setIsLoggedIn] = useState(false); // check if user is logged in
    const location = useLocation();
    const email = localStorage.getItem("email");
    const [clockinClicked, setClockinClicked] = useState(false); // Clock in button enable/disable
    const [clockoutClicked, setClockoutClicked] = useState(false); // Clock out button enable/disbale
    const [clockinTime, setClockinTime] = useState(null); // Clock in time
    const [clockoutTime, setClockoutTime] = useState(null); // Clock out time
    const [calculatedTime, setCalculatedTime] = useState(""); // Calculated time
    const [userStatus, setUserStatus] = useState(''); // User status
    const [userName, setUserName] = useState(''); // User name
    const [accountType, setAccountType] = useState(''); // Account type

    // use effects
    useEffect(() => {
        getUserType();
        getUserStatus();
    }, []);

    useEffect(() => {
        if (clockinTime instanceof Date && clockoutTime instanceof Date) {
            console.log('Effect running with clockoutTime:', clockoutTime, 'Type:', typeof clockoutTime);
            postHours();
        } else {
            console.log('Waiting for both clockinTime and clockoutTime to be set.');
        }
    }, [clockinTime, clockoutTime]);
    

    // Get username and stuff
    const getUserType = () => {
        fetch(`${backendUrl}${routerPath}/login?email=${email}`, {
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            }
        })
            .then(res => res.json())
            .then(data => {
                setAccountType(data.data);
                setUserName(data.username);
            })
            .catch((error) => {
                console.log(error + " error from login data retrieval"); // error msg if there is an error when retrieving the data
            })
            .catch((err) => {// error msg if there is an error reading the json from the backend
                console.log(err)
            })
    }

            // Get clock in time
    const getClockinTime = () => {
        if (!clockinClicked) {
            const date = new Date();
            setClockinTime(date); // Save the Date object directly
            setClockinClicked(true);
            setUserStatus("Clocked in");
        }
    };



    // Get clock out time
    const getClockoutTime = () => {
        if (!clockoutClicked && clockinClicked) {
            const date = new Date();
            console.log('About to set clockoutTime with:', date);
            setClockoutTime(date);
            setClockoutClicked(true);
            calculateWorkedTime(clockinTime, date);
            setUserStatus("Clocked out");
        } else {
            console.log('getClockoutTime was called but did not set clockoutTime.', { clockinClicked, clockoutClicked });
        }
    };
    

    // Calculate the worked time
    const calculateWorkedTime = (start, end) => {
        const timeDiff = end - start; // Calculate difference in milliseconds
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setCalculatedTime(`${hours} hours ${minutes} minutes ${seconds} seconds`);
    };

    // Get user status
    const getUserStatus = () => {
        setUserStatus("Clocked out");
    };

    const postHours = () => {
        if (clockinTime instanceof Date && clockoutTime instanceof Date) {
            const clockInIsoString = clockinTime.toISOString();
            const clockOutIsoString = clockoutTime.toISOString();
    
            fetch(`${backendUrl}${routerPath}/clock/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userName, 
                    clockIn: clockInIsoString,
                    clockOut: clockOutIsoString
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update hours worked');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('Hours worked updated successfully');
                // Any post-success logic here
            })
            .catch(error => {
                console.error('Error updating hours worked:', error);
                alert('Error updating hours worked. Please check console for details.');
            });
        } else {
            console.error('clockinTime or clockoutTime is not a Date object.', {
                clockinTime, clockoutTime,
                clockinTimeType: typeof clockinTime, clockoutTimeType: typeof clockoutTime
            });
        }
    };

    const handleGeneratePayStub = async () => {
        try {
            const response = await axios.post('/api/paystub/generate'); // Make a POST request to the backend endpoint
            console.log(response.data); // Log the response from the backend
            alert('Pay stub CSV generated successfully!');
        } catch (error) {
            console.error('Error generating pay stub CSV:', error);
            alert('Error generating pay stub CSV. Please check console for details.');
        }
    };
    

    
    return (
        <div>
            <main>
                <div className="clock-header">
                    <h1 className="clock-header-text">Name: {userName}</h1>
                    <h2 className="clock-status-text">Status: {userStatus}</h2>
                </div>
                <div className="clockin-container">
                    <h3 name="clockin-time">{clockinTime instanceof Date ? `Clock-in Time: ${clockinTime.toLocaleTimeString()}` : ''}</h3>
                    <button className="clockin-Btn" onClick={getClockinTime} disabled={clockinClicked}>Clock In</button>
                </div>
                <div className="clockout-container">
                    <h3 name="clockout-time">{clockoutTime instanceof Date ? `Clock-out Time: ${clockoutTime.toLocaleTimeString()}` : ''}</h3>
                    <button className="clockout-Btn" onClick={getClockoutTime} disabled={!clockinClicked || clockoutClicked}>Clock Out</button>
                </div>
            
                <div className="clock-logout-container">
                    
                    <Link 
                        to="/" 
                        className="clock-logout-Btn" 
                        onClick={() => { 
                            setClockinClicked(false); 
                            setClockoutClicked(false); 
                            localStorage.removeItem('email'); 
                            postHours(); 
                        }}
                    >
                        Logout
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Clock;