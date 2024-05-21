import React, {useContext} from 'react'
import './ch.css'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import GlobalContext from '../../context/GlobalContext';
import dayjs from 'dayjs';

const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL

export default function CalendarHeader() {
  const {monthIndex, setMonthIndex} = useContext(GlobalContext);

  const googleAccountLogin = () => {
    fetch(`${backendUrl}/api/google`)
    .then(res => res.json()
    .then(data => {
      window.location.href = data.url;
    })
    .catch(error => console.error('error returning data',error))
    )
    .catch(error => console.error(error));
  }


  function handlePrevMonth() {
      setMonthIndex(monthIndex - 1);//previous month index
  }
  function handleNextMonth(){
      setMonthIndex(monthIndex + 1);//next month
  }
  function handleResetCurrentMonth(){
    setMonthIndex(dayjs().month())
  }
  const callGoogleAccountLogin = () =>{
    googleAccountLogin();
  }

  return (
    <header className='calendar-header-header'>
      <h1 className='calendar-header-title'>
          {}
          Calendar
      </h1>
      {localStorage.getItem("Account-Type")==="Admin" &&
        <button className='btn-login-gc' onClick={callGoogleAccountLogin}>Sync Google Calendar</button>
      }
      <button onClick={handleResetCurrentMonth} className="today-btn">
          Today
      </button>
      <button onClick={handlePrevMonth}>
          <span className='navigation-btns'>
            <MdOutlineKeyboardArrowLeft />
          </span>
      </button>
      <button onClick={handleNextMonth}>
          <span className='navigation-btns'>
              <MdOutlineKeyboardArrowRight/>
          </span>
      </button>
      <h2 className='current-month-and-year-title'>
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>

    </header>
  )
}
