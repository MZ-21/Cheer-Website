import React, { useContext, useEffect, useState } from 'react'
import './eventm.css'
import { MdOutlineDragHandle } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import GlobalContext from '../../context/GlobalContext';
import { MdOutlineSchedule } from "react-icons/md";
import { MdSegment } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa6";

const labelsClasses = ['indigo','gray','green','blue','red','purple'];
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL

export default function EventModel() {
    const { setShowEventModel, daySelected, dispatchCallEvent, selectedEvent } = useContext(GlobalContext);
    const [ title, setTitle ] = useState(selectedEvent ? selectedEvent.title : "");
    const [ startTime, setStartTime ] = useState(selectedEvent ? selectedEvent.startTime : "");
    const [ endTime, setEndTime ] = useState(selectedEvent ? selectedEvent.endTime : "");
    const [ description, setDescription ] = useState(selectedEvent ? selectedEvent.description: '');
    const [ selectedLabel, setSelectedLabel ] = useState(selectedEvent ? labelsClasses.find((lbl) => lbl === selectedEvent.label) : labelsClasses[0]);
    const [disableEventInput, setDisableEventInput] = useState('');
    const [accountType, setAccountType] = useState('');
    const [registerMsg,setRegisterMsg] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState('');
    const [newDescription, setNewDescription] = useState(false);
    
    function handleSubmit(e, onlyNewEvent=false){
       e.preventDefault();
        const calendarEvent = {
            title,
            description,
            label: selectedLabel,
            day: daySelected.valueOf(), //timestamp
            startTime,
            endTime, 
            id: selectedEvent ? selectedEvent.id : Date.now(),
        };
        if(selectedEvent){
            dispatchCallEvent({type: 'update', payload: calendarEvent});//updating new event 
            handleNewEvent(calendarEvent,"update");
    
            
        }else{
            handleNewEvent(calendarEvent,"create")
            .then((event_id)=>{
                calendarEvent.id = event_id;
                dispatchCallEvent({type: 'push', payload: calendarEvent});//pushing new event 

            })
            .catch(error=>{console.error(error, " error when retrieving id after creating event!")})
        }
        // setShowEventModel(false);
       
    }
    useEffect(() => {
        console.log("error not here before description if statement");
   
        if (selectedEvent && description !== selectedEvent.description) {
        
            const calendarEvent = {
                title,
                description,
                label: selectedLabel,
                day: daySelected.valueOf(), //timestamp
                startTime,
                endTime, 
                id: selectedEvent ? selectedEvent.id : Date.now(),
            };
            dispatchCallEvent({type: 'update', payload: calendarEvent});//updating new event 
            setNewDescription(true);
            
        }
        console.log("error not here after if");
    }, [description]);
    useEffect(() => {
        setAccountType(localStorage.getItem("Account-Type"));
    
        if(accountType !== "Admin"){
            setDisableEventInput("disabled");
        }
        else{
            setDisableEventInput("");
        }
    },[accountType, newDescription, selectedEvent]);

    function handleRegisterForEvent(e) {
        e.preventDefault();
    
        let updatedDescription = '';

        if (description.includes("Registered:")) {
            var list_users = selectedEvent.description.split("Registered:");
            updatedDescription = list_users[0].trim() + ` \nRegistered: ${localStorage.getItem("email")}, ` + list_users[1].trim();
            var updated_event_flag = '★ ' + selectedEvent.title;
            setTitle(updated_event_flag);
        } else {
            console.log("error not here");
            updatedDescription = description.trim() + ` \nRegistered: ${localStorage.getItem("email")}`;
            updated_event_flag = '★ ' + selectedEvent.title;
            setTitle(updated_event_flag);
            console.log("Eror not here");
        }
    
        setDescription(updatedDescription);
        setRegisterMsg("Registered");

    }
    function handleNewEvent(c_event,type){
        var email = localStorage.getItem('email');
            var c_event_json = JSON.stringify(c_event);
            var requestBody = {
                "savedEvent": c_event_json,
                "email": `${email}`,
                "type": `${type}`
            };
            
            return fetch(`${backendUrl}/api/schedule_event`,{
                method: 'POST', //
                headers: {
                'Authorization': `Bearer ${localStorage.getItem("google_token")}`,
                'Content-Type': 'application/json', 
                },
                body: JSON.stringify(requestBody), 
            })
            .then(res => res.json()
            .then(data => {
                return data.event_saved_id;
            })
            .catch((error)=> {
                console.log(error + " Error when retrieving data!")
            })
            )
    }
    return (
        <div className='event-form-container'>
            <form className='event-form'>
                <header className='event-form-header'>
                    <span className='icons'>
                        <MdOutlineDragHandle />
                    </span>
                    <div>
                        {selectedEvent && (
                            <span onClick={() => {
                                if(accountType ==="Admin"){ 
                                    dispatchCallEvent({type: 'delete', payload: selectedEvent});
                                }
                                setShowEventModel(false);
                                }} className='icons'>
                                 <MdDelete />
                            </span>
                        )}
                        <button onClick={() => setShowEventModel(false)}>
                            <span className='icons'>
                                 <IoIosClose />
                            </span>
                        </button>
                    </div>
                 

                </header>
                <div className='div-container-event-box'>
                    <div className='grid-event-container-box'>
                        <div></div>
                        <input className='event-form-input-title' type="text" name='title' placeholder='Add title' value={title} required onChange={(e) => setTitle(e.target.value)} disabled={disableEventInput}/>
                        <span className='schedule-icon-form-event'>
                            <FaRegCalendar/>
                        </span>
                        <p className='bottom-date-event-form'>{daySelected.format('dddd, MMMM DD')}</p>
                        <span>
                            <MdOutlineSchedule/>
                        </span>
                        <input className='event-form-input-time' type="text" name='time' placeholder='Start Time (HH:MM)' value={startTime} required onChange={(e) => setStartTime(e.target.value)} disabled={disableEventInput}/>
                        <span>
                            <MdOutlineSchedule/>
                        </span>
                        <input className='event-form-input-time' type="text" name='time' placeholder='End Time (HH:MM)' value={endTime} required onChange={(e) => setEndTime(e.target.value)} disabled={disableEventInput}/>
                        <span className='schedule-icon-form-event'>
                            <MdSegment />
                        </span>
                        <input className='event-form-input-description' type="text" name='description' placeholder='Add Description' value={description} onChange={(e) => setDescription(e.target.value)} disabled={disableEventInput}/>
                        <span className='schedule-icon-form-event'>
                            <MdOutlineBookmarkBorder />
                        </span>
                        <div className="color-labels-container ">
                            {labelsClasses.map((lblClass,i) => (
                                <span key={i} onClick={() => setSelectedLabel(lblClass)} className={`color-labels ${lblClass}`}>
                                    {selectedLabel === lblClass && 
                                     <span className='check-icon'>
                                        <FaCheck/>
                                     </span>
                                    }
                                   
                                    
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <footer className='event-form-footer'>
                    {accountType === "Admin" ? (
                        <button type='submit' onClick={(e) => handleSubmit(e)} className='event-form-footer-submit-btn'>
                        Save
                        </button>
                    ):(
                        <>
                        <button type='submit' onClick={(e) => handleRegisterForEvent(e)} className='event-form-footer-submit'>
                        Register
                        </button>
                        {registerMsg}
                        </>
                    )}
                    
                </footer>
            </form>

        </div>
    )
}
