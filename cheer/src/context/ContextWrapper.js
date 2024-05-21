import React, { useEffect, useMemo, useReducer } from 'react'
import GlobalContext from './GlobalContext'
import { useState } from 'react'
import dayjs from 'dayjs';

const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL

function savedEventsReducer(state, {type, payload}){
    switch(type){
      case 'push': //push to current state
        return [...state, payload]//spreading state and concatenating it with the payload
      case 'update':
        return state.map(evt => evt.id === payload.id ? payload : evt)//comparing event id to payload id and returning the event/payload
      case 'delete':
        var event_to_delete = state.filter(evt => evt.id === payload.id);
        deleteEvent(event_to_delete,"delete");
        return state.filter(evt => evt.id !== payload.id)//returning event that has everything that is different from the payload
      default:
      throw new Error();
        
    }
}
function deleteEvent(c_event,type){
  var email = localStorage.getItem('email');
  var c_event_json = JSON.stringify(c_event);
  
  var requestBody = {
      "savedEvent": c_event_json,
      "email": `${email}`,
      "type": `${type}`
  };
  
  fetch(`${backendUrl}/api/delete_event`,{
      method: 'POST', //
      headers: {
      'Authorization': `Bearer ${localStorage.getItem("google_token")}`,
      'Content-Type': 'application/json', 
      },
      body: JSON.stringify(requestBody), 
  })
  .then(res => res.json()
  .then(data => {
      console.log(data,"this is returned deleted data");
  })
  .catch((error)=> {
      console.log(error + " Error when retrieving data!")
  })
  )
}
function initEvents(){
  const storageEvents = localStorage.getItem('savedEvents');
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;

}
export default function ContextWrapper(props) {
  const [monthIndex,setMonthIndex] = useState(dayjs().month());
  const [showEventModel,setShowEventModel] = useState(false);
  const [selectedEvent,setSelectedEvent] = useState(null);
  const [daySelected,setDaySelected] = useState(dayjs());
  const [labels, setLabels] = useState([]);
  const [savedEvents, dispatchCallEvent] = useReducer(savedEventsReducer, [], initEvents);
  const [addEvent, setAddedEvent] = useState([]);

  useEffect(()=>{
    localStorage.setItem('savedEvents',JSON.stringify(savedEvents));

  }, [savedEvents]);

  useEffect(()=>{
    setLabels((prevLabels) => {
      return [...new Set( savedEvents.map(evt => evt.label))].map(label => {
        const currentLabel = prevLabels.find(lbl => lbl.label === label)  
        return {
              label,
              checked: currentLabel ? currentLabel.checked : true,
          }
      }) //only want unique set
    })
  },[savedEvents]);

  useEffect(()=>{
    if(!showEventModel){
      setSelectedEvent(null);//clearing event form so user can click on different date 
    }
  }, [showEventModel]);  

  const filteredEvents = useMemo(()=>{//want to memorize these values, dont want to render each time
      return savedEvents.filter(evt => 
        labels
          .filter(lbl => lbl.checked)
          .map(lbl => lbl.label)
          .includes(evt.label)
      );
  }, [savedEvents, labels]);//dependecies are labels and saved events
  
  function updateLabel(label){
    setLabels(labels.map((lbl)=>lbl.label === label.label ? label : lbl))
  }

  return (
    <GlobalContext.Provider 
    value={{ 
        monthIndex, 
        setMonthIndex, 
        showEventModel,
        setShowEventModel,
        daySelected,
        setDaySelected,
        dispatchCallEvent,
        savedEvents,
        selectedEvent,
        setSelectedEvent,
        labels,
        setLabels,
        updateLabel,
        filteredEvents
        }}>
        {props.children} 
    </GlobalContext.Provider>
  )
}
