import React, { useContext } from 'react'
import GlobalContext from '../../context/GlobalContext'
import './labels.css'
export default function Labels() {
const {labels, updateLabel} = useContext(GlobalContext);  
return (
    <React.Fragment>
        <p className='labels-sidebar-tag'>Label</p>
        {labels.map(({label: lbl, checked}, idx)=>(
            <label key={idx} className='each-label-sidebar'>
                <input onChange={()=> updateLabel({label: lbl, checked : !checked})} type='checkbox' checked={checked} className={`checkbox-input-labels-sidebar ${lbl}`}></input>
                <span className='lbl-color-sidebar'>{lbl}</span>


            </label>
        ))}
    </React.Fragment>
  )
}
