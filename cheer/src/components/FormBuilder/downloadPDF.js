import React, { useEffect, useState } from 'react';
import "./downloadPDF.css"; 
import axios from "axios";
import { pdfjs } from 'react-pdf'

const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080` // The backend URL`;
const routerPath = `/api`;
function DownloadPDF(){
    const [doc, setDoc] = useState(null)
   //const [pdfFile, setPdfFile] = useState(null)

    const getPdf = async ()=>{
        console.log("in ccc")
        const result = await axios.get(`${backendUrl}/api/getForms`)
        //console.log(result.data.data);
   
        setDoc(result.data.data);

    }
  

    useEffect(()=>{

        getPdf()
    }, []);
    
 
    const showPdf = (pdf)=>{
        console.log("in admin pdfs")
        console.log("in admin pdfs")
      window.open(`${backendUrl}/adminPdfs/${pdf}`, "_blank", "noreferrer")
  
    }


    return (
        <div className='login-container'>
            <h3 className='login-header'>Forms to fill:</h3>
            {doc==null?"" : doc.map((data,index)=>{
                return (
                    <div key={index}>
                        <h6 className='title'>Title: {data.title}</h6>
                        <button className="btnStyle" onClick={() => showPdf(data.pdf)}>View form</button>
                        </div>
                )
            })}
       
 
         
     
        </div>
    )
}
export default DownloadPDF