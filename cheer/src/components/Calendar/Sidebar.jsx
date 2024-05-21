import React, {useContext} from 'react'
import CreateEventButton from './CreateEventButton.jsx'
import Labels from './Labels.jsx';
import GlobalContext from '../../context/GlobalContext';
export default function SidebarCalendar() {
  const {accountTypeGlobal} = useContext(GlobalContext);
  console.log(accountTypeGlobal,"this is account type");
  return (
    <div>
      <aside className='create-event-btn'>
          {localStorage.getItem("Account-Type") === 'Admin' &&
             <CreateEventButton/>
          }
      </aside>
      <div className='labels-container'>
        <Labels/>
      </div>
    </div>
  );
}
