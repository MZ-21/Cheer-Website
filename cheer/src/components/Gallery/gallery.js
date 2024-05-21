import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./gallery.css"
// Import the CSS file for styling


const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL
const routerPath = `/api`;

const GalleryPhotos = () => {
    const [status, setSatus ]= useState()

    useEffect(() => {
        const getCodeFromURL = () => {
            const queryParams = new URLSearchParams(window.location.search);
            return queryParams.get('code');
        };

        const code = getCodeFromURL();

        if (code) {
            axios.get(`${backendUrl}${routerPath}/gimages?code=${code}`)
                .then(response => {
                   var message = response.data.message
                   
                        setSatus(message)
                 
                })
                .catch(error => {
                   
                });
        }
    }, []);

   

    return (
        <div className='bodyOfGallery'>
            <h1 className='titleCheerA'>Gallery Upload</h1>
   
   
          <h3 className='subtitleCheerA {'>{status}</h3>
        </div>
    );
};

export default GalleryPhotos;





