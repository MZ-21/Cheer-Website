import React, { useEffect, useState } from 'react';
import "./pdf.css"
import axios from "axios";
import { pdfjs } from 'react-pdf'
import PdfComp from './PdfComp';
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080` // The backend URL`;
const routerPath = `/api`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


function PdfAccess(){
    const [doc, setDoc] = useState(null)
    const [pdfFile, setPdfFile] = useState(null)

    const getPdf = async ()=>{
        const result = await axios.get(`${backendUrl}/api/getPdfs`)
        console.log(result.data.data);
        setDoc(result.data.data);
    }
  

    useEffect(()=>{
        getPdf()
    }, []);
    
 
    const showPdf = (pdf)=>{
     
        setPdfFile(`${backendUrl}/files/${pdf}`)
    }
    const downloadPdf= (pdf)=>{
        window.open(`${backendUrl}/files/${pdf}`, "_blank", "noreferrer")
    }

  



    return (
        <div>
            <div className='login-container '>
            <h4>Client Forms:</h4>
            {doc==null?"" : doc.map((data,index)=>{
                return (
                    <div key={index}>
                        <h6>File description: {data.title}</h6> 
                        <button className="btnStyle" onClick={() => downloadPdf(data.pdf)}> Download Pdf</button>
                        <button className="btnStyle" onClick={() => showPdf(data.pdf)}> Show Pdf</button>
                        </div>
                )
            })}
       
 
         </div>
            <PdfComp pdfFile={pdfFile}/>
        </div>
    )
}
export default PdfAccess