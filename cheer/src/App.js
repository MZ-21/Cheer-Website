import './App.css';
import Navbar from './components/Home/Navbar.jsx';
import Login from './components/Login/login.jsx';
import CreateAccount from './components/CreateAccount/ca.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home/home.jsx';
import Contact from './components/Contact/contact.jsx';
import MainPage from "./components/MainPage/MainPage.jsx";
import DownloadPDF from './components/FormBuilder/downloadPDF.js';
import UploadPDF from './components/FormBuilder/uploadPDF.js';
import PdfAccess from './components/FormBuilder/pdfAccess.js';
import UploadPDFAdmin from './components/FormBuilder/uploadPDFadmin.js';
import NewsletterUpload from './components/Newsletter/newsletter.jsx';
import About from './components/About/about.jsx'
import Calendar from './components/Calendar/schedule.jsx';
import ContextWrapper from './context/ContextWrapper.js';
import TextToSpeechTrigger from './components/TextToSpeech/TextToSpeechTrigger.jsx';
import Chatroom from './components/Chatbox/Chatroom.jsx';
import Gallery from './components/Gallery/adminUploadimages.js';
import GalleryPhotos from './components/Gallery/gallery.js';
import FetchImagesComponent from './components/FetchImages/FetchGallery.js';
import Verified from './components/Calendar/Verified.jsx';
import ReviewForm from './components/Reviews/reviewForm.jsx';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <><Navbar /><Home /></> },
    { path: 'contact', element: <><Navbar /><Contact /></> },
    { path: 'login', element: <><Navbar /><Login /></> },
    { path: 'signup', element: <><Navbar /><CreateAccount /></> },
    { path: 'calendar', element: <><Navbar /><ContextWrapper><Calendar/></ContextWrapper></> },
    { path: 'about', element: <><Navbar /><About /></> },
    { path: 'downloadPDF', element: <><Navbar/><DownloadPDF/></> },
    { path: 'uploadPDF', element: <><Navbar/><UploadPDF/></> },
    { path: 'pdfAccess', element: <><Navbar/><PdfAccess/></> },
    { path: 'pdfUploadAdmin', element: <><Navbar/><UploadPDFAdmin/></> },
    { path: 'reviews', element: <><Navbar/><ReviewForm/></> }, 
    { path: 'main', element: <><Navbar/><MainPage/></> },
    { path: 'newsletter', element: <><Navbar /><NewsletterUpload /></> },
    { path: 'chatbox', element: <Chatroom /> },
    { path: 'gallery', element: <><Navbar /><Gallery /></> },
    { path: 'verified', element: <Verified /> },
    { path: 'imagesVerified', element: <><Navbar /><GalleryPhotos/></> },
    { path: 'fetchImages', element: <><Navbar /><FetchImagesComponent/></> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <TextToSpeechTrigger style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }} />
    </div>
  );
}

export default App;
