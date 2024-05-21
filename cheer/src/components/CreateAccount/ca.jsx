import React, { useEffect } from 'react';
import {useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Password } from '../Password/Password';
import background from './cheergroup.png';
import './ca.css'; 
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080` // The backend URL`;
const routerPath = `/api`;
  

function CreateAccount (){
    const [email, setEmail] = useState(''); //update username
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState(''); //update state password if need
    const [passwordCheck, setPasswordCheck] = useState(''); //update state confirm password if need
    const [firstName, setFirstName] = useState(''); //update state first name
    const [lastName, setLastName] = useState(''); //update state last name
    const [allergies, setAllergies] = useState(''); //updating allergies inputted
    const [medicalC, setMedicalC] = useState(''); //updating state medical condition
    const [extraInfo, setExtraInfo] = useState(''); //updating state extra info
    const [relationships, setRelationships] = useState(''); //updating state extra info
    const [msg, setMsg] = useState('');//Updating a msg to notify the user 
    const [open,setOpen] = useState(false);//toggling open and closed 
    const [selectedA,setSelectedA] = useState(false);//displaying client fields
    const [selectedClient,setSelectedClient] = useState(false);//displaying client fields
    const [selectedCaregiver,setSelectedCaregiver] = useState(false);//displaying caregiver fields
    const [selectedStaff,setSelectedStaff] = useState(false);//displaying staff fields
    const [accountUserChose,setAccountUserChose] = useState('');
    const [clientPassword, setClientPassword] = useState([]); // updates the client password



   


    useEffect (()=>{
        
    })

    const validateAccountAvailability = () => {
        if((password === passwordCheck && password !== '') || selectedClient && clientPassword.length === 5){//ensuring they confirm their password
            var requestBody = {//Sending the inputted information to the backend
                "username": `${username}`,
                "email":`${email}`,
                "password":`${password}`,
                "firstName":`${firstName}`,
                "lastName":`${lastName}`,
                "allergies":`${allergies}`,
                "relationship":`${relationships}`,
                "medicalCondition":`${medicalC}`,
                "userType":`${accountUserChose}`,
                "extraInfo":`${extraInfo}`,
            }

            if(selectedClient){ // for client accounts
                requestBody = {//Sending the inputted information to the backend
                    "username": `${username}`,
                    "email":`${email}`,
                    "password":`${clientPassword.join()}`,
                    "firstName":`${firstName}`,
                    "lastName":`${lastName}`,
                    "allergies":`${allergies}`,
                    "relationship":`${relationships}`,
                    "medicalCondition":`${medicalC}`,
                    "userType":`${accountUserChose}`,
                    "extraInfo":`${extraInfo}`,
                }
            }

            fetch(`${backendUrl}${routerPath}/signup`,{
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify(requestBody), // Convert the object to a JSON string
    
            })
            .then(res => res.json()
            .then(data => {
                for(let dataV in data){
                    if(dataV === "message"){//displaying the message returned by the backend to notify the user
                        setMsg(data[dataV]);//setting that msg to be displayed
                    }
    
                }
            
            }))
            .catch((error) => {
                console.log(error);
            })

        }
        else{
            if(selectedClient && clientPassword !== 5){
                setMsg('Must be 5 pictures!');
            }
            else if(password === ''|| passwordCheck ===''){
                setMsg("One of the password fields is empty!");
            }
            else {
                setMsg("Passwords don't match!");//notifying user if the passwords dont match
            }
        }

    }
    // // <Dropdown accountTypes={accountTypes} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />;
    function accountType(type){
        //
        if(type.text === 'Client'){
            setAccountUserChose(type.text);//setting the value of accountUserChose to the type of account they want
            setSelectedA(true);//Displaying the hidden container containing the input fields
            setSelectedClient(true);//setting the type to client if client is clicked
            setSelectedCaregiver(false);
            setSelectedStaff(false);
        }
        if(type.text === 'Caregiver'){
            setAccountUserChose(type.text);//setting the value of accountUserChose to the type of account they want
            setSelectedA(true);//Displaying the hidden container containing the input fields
            setSelectedCaregiver(true);//setting the type to caregiver if caregiver is clicked
            setSelectedClient(false);
            setSelectedStaff(false);

        }
        if(type.text === 'Staff'){
            setAccountUserChose(type.text);//setting the value of accountUserChose to the type of account they want
            setSelectedA(true);//Displaying the hidden container containing the input fields
            setSelectedStaff(false);//setting the staff to false
            setSelectedCaregiver(false);
            setSelectedClient(false);
        }

    }
    function DropdownItem(props){//fucntion for switching between different clients 
        return(
            <li className='dropdownItem' onClick={() => {accountType(props)}}>
                <a>{props.text}</a>
            </li>
        )
    }

    // manage client password changes
    const handlePasswordChange = (newPassword) => {
        if (newPassword !== clientPassword) {
            setClientPassword(newPassword);
        }
    }

    //Allergies, medical condition, extra info, first name , last name
    return (
        <div id="ca-cr">
            <div className="ca-container">
                    <div className="ca-header">
                        <h1>CREATE ACCOUNT:</h1>
                        <div className='ca-dropdown-menu-container'>
                            <div className='ca-dropdown-menu-text-container' onClick={()=> {setOpen(!open)}}>
                                <h3 className='ca-title-menu'>Select Account Type</h3>
                            </div>
                            {open && (
                                 <div className={`ca-dropdown-menu ${open? 'active' : 'inactive'}`}>
                                    <ul>
                                        <DropdownItem text={"Client"} />
                                        <DropdownItem text= {"Staff"} />
                                        <DropdownItem text= {"Caregiver"}/>
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                    </div>
                    {selectedA && (
                        <>
                        <div className={`ca-account-selection ${selectedA? 'active' : 'inactive'}` }>
                        <div className="ca-input-container">
                            <div className="ca-email-input">
                                <p className="ca-input-identifier">Email:</p>
                                <input className="ca-input" type='text'placeholder='email' onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className="ca-first-name-input ca-input-container">
                                <p className="ca-input-identifier">First Name:</p>
                                <input className="ca-input" type='text'placeholder='first name' onChange={(e) => setFirstName(e.target.value)}></input>
                            </div>
                            <div className="ca-last-name-input ca-input-container">
                                <p className="ca-input-identifier">Last Name:</p>
                                <input className="ca-input" type='text'placeholder='last name' onChange={(e) => setLastName(e.target.value)}></input>
                            </div>
                            <div className="ca-username-input ca-input-container">
                                <p className="ca-input-identifier">Username:</p>
                                <input className="ca-input" type='text'placeholder='username' onChange={(e) => setUsername(e.target.value)}></input>
                            </div>
                            {selectedClient && <Password onPasswordChange={handlePasswordChange}/>}
                            
                            {!selectedClient && (
                                <>
                                    <div className="ca-password-input ca-input-container">
                                        <p className="ca-input-identifier">Password:</p>
                                        <input className="ca-input" type='password' placeholder='password' onChange={(e) => setPassword(e.target.value)}></input>
                                    </div>                            
                                    <div className="ca-password-check-input ca-input-container">
                                        <p className="ca-input-identifier">Confirm Password:</p>
                                        <input className="ca-input" type='password' placeholder='confirm password' onChange={(e) => setPasswordCheck(e.target.value)}></input>
                                    </div>
                                </>
                            )}
                            <div className={`ca-relationships-input ca-input-container ${selectedCaregiver? 'active' : 'inactive'}`}>
                                <p className="ca-input-identifier">Relationship:</p>
                                <input className="ca-input" type='text' placeholder='relationship to client' onChange={(e) => setRelationships(e.target.value)}></input>
                            </div>
                            <div className={`ca-allergies-input ca-input-container ${selectedClient? 'active' : 'inactive'}`}>
                                <p className="ca-input-identifier">Allergies:</p>
                                <input className="ca-input" type='text' placeholder='allergies separated by commas' onChange={(e) => setAllergies(e.target.value)}></input>
                            </div>
                            <div className={`ca-mc-input ca-input-container ${selectedClient? 'active' : 'inactive'}`}>
                                <p className="ca-input-identifier">Medical Condition:</p>
                                <input className="ca-input" type='text' placeholder='medical condition' onChange={(e) => setMedicalC(e.target.value)}></input>
                            </div>
                            <div className={`ca-extra-input ca-input-container ${selectedClient? 'active' : 'inactive'}`}>
                                <p className="ca-input-identifier">Extra Information:</p>
                                <input className="ca-input" type='text' placeholder='extra' onChange={(e) => setExtraInfo(e.target.value)}></input>
                            </div>
                        </div>
                        <div>
                            <button className='ca-btn' onClick={validateAccountAvailability}>Register</button>
                            <div className='ca-msg-container'>
                                {msg}
                            </div>
                        </div>
                    </div>
                        <p>Already have an account? <Link to="/login">Login</Link></p>    
                    </>    
                    )}
            </div>
        </div>
    );
};

export default CreateAccount;