import React, { useContext } from 'react'
import { FaPlus } from "react-icons/fa";
import './createventbtn.css'
import GlobalContext from '../../context/GlobalContext';
export default function CreateEventButton() {
    const {setShowEventModel, setDaySelected} = useContext(GlobalContext)

  return (
    <button onClick={()=> {setShowEventModel(true)}} className='create-event-btn'>
        <FaPlus/>
        <span className='pl-3 pr-7'> Create</span>
    </button>
  )
}
