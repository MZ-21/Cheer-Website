//import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";
import "./gallery.css"
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080` // The backend URL`;
const routerPath = `/api`;




const AdminImages=()=>{
    //const [image, setImage] = useState();
    const [url, setUrl] = useState('')

    const getImages=async()=>{
        try{ const result = await axios.get(`${backendUrl}${routerPath}/images`);
    
        // Use .then() to handle additional operations after receiving the response
       console.log("result" ,result)
    
        setUrl(result.data.loginUrl);
         }catch(e){
            console.log(e)
         }
       
     
    }
    return (
        <div className='bodyOfGalleryAdmin'>

            <Link to={url} className='linkG' onClick={() => getImages()}>Click here to sync your google photos to CHEER</Link>
     
        </div>
    )



}
export default AdminImages