import React, {useState, useContext, useEffect} from "react";
import { getMonth } from "../../util.js";
import CalendarHeader from "./CalendarHeader.jsx"
import  SidebarCalendar  from "./Sidebar.jsx"
import  Month  from "./Month.jsx"
import './scheduler.css'
import GlobalContext from "../../context/GlobalContext.js";
import EventModel from "./EventModel.jsx";

function Calendar() {

    //console.table(getMonth());
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const {monthIndex, showEventModel} = useContext(GlobalContext);
    useEffect(()=>{
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

     return (
        <React.Fragment>
            {showEventModel && (
                <EventModel/>
            )}
            <div className="h-screen flex flex-col">
                <CalendarHeader/>
                <div className="sidebar-month flex flex-1">
                    <div>
                        <SidebarCalendar/>
                    </div>
                    
                    <Month month={currentMonth}/>
                </div>
            </div>
        </React.Fragment>    
        )
}

export default Calendar;


















    // const [event, setEvent] = useState('');
    // const [clickedD,setClickedDate] = useState(false);

    // const handleDateClick = (arg) => { // bind with an arrow function
    //     //alert(arg.dateStr)
        
    //     //get user input
    //     setClickedDate(true);
    // }

    // // function renderEventContent(eventInfo) {
    // //     return (
    // //       <>
    // //         <b>{eventInfo.timeText}</b>
    // //         <i>{eventInfo.event.title}</i>
    // //       </>
    // //     )
    // // }

    // const createEvent = (title,startDate,endDate,allDayBool,daysOfWeekRepeats,startTime,endTime,endRecurDate,editable,color) => {
    //     console.log("clicked")
    //     const newEvent = {
    //         id: 'primary', 
    //         groupId: '',
    //         title: title,
    //         start: startDate,
    //         end: endDate,
    //         allDay: allDayBool,
    //         daysOfWeek: daysOfWeekRepeats,
    //         startTime: startTime,
    //         endTime: endTime,
    //         endRecur: endRecurDate,
    //         classNames: 'calendar-events',
    //         editable: editable,
    //         color: color,
    //     }
    //     return newEvent;
    // }
    // const handleEventSubmit = (formData) => {
    //     // Logic to create an event using formData
    //     console.log("Creating event:", formData);
    //     // Add code to update your calendar events state or make an API call
    //     setClickedDate(false);//rehiding the form
    //   };
   
    // return (
    //     <div>
    //         {clickedD &&
    //             <EventFormCreator onSubmit={handleEventSubmit} />
            
    //         }
    //         <Fullcalendar 
    //             plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
    //             initialView={'timeGridWeek'}//setting initial view to week
    //             headerToolbar={{
    //                     start: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the left. if RTL, will be on the right
    //                     center: "title",
    //                     end: "today prev,next", // will normally be on the right. if RTL, will be on the left
    //             }}
    //             height={'90vh'}//setting height to 90% of the height
    //             events ={event}
    //             dateClick={handleDateClick}
    //            // eventContent={renderEventContent}
            
    //         />
    //     </div>
    // )