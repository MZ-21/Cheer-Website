import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import './day.css';
import GlobalContext from '../../context/GlobalContext';
export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {setDaySelected, setShowEventModel, filteredEvents, setSelectedEvent} = useContext(GlobalContext);
  

  useEffect(()=>{
    const events = filteredEvents.filter(evt => dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")) //filters for where new dayjs object = to day prop
    setDayEvents(events);

  },[filteredEvents, day]);

  function getCurrentDayClass(){
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") 
    ? 'blue-days' : '';
  }

  return (
    <div className='div-header-days'>
      <header className='header-days'>
        {rowIdx === 0 && (
           <p className='p-tag-weekday text-sm mt-1'>{day.format('ddd').toUpperCase()}</p>
        )}
        <p className={`p-text-DD ${getCurrentDayClass()}`}>
            {day.format('DD')}
        </p>
      </header>  
      <div className='flex-1 cursor-pointer' onClick={() => {
            setDaySelected(day);
            setShowEventModel(true);
        }}>
          {dayEvents.map((evt, idx)=>(
              <div key={idx} onClick={()=>setSelectedEvent(evt)} className={`event-box-display ${evt.label}`}>
                  {evt.title}
              </div>
          ))}

      </div>
    </div>
   
  )
}

