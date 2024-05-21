// import React, {useState} from "react";
// import '../EventForm/form.css'

//     function EventFormCreator({ onSubmit }) {
//         console.log("called")
        
//         const [formData, setFormData] = useState({
//             title: "",
//             startDate: "",
//             endDate: "",
//             // Add other form fields as needed
//         });

//         const handleInputChange = (e) => {
//           const { name, value } = e.target;
//           setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//           }));
//         };
      
//         const handleSubmit = (e) => {
//           e.preventDefault();
//           onSubmit(formData);
//         };
      
//         return (
//           <div className="events-form">
//             <form onSubmit={handleSubmit}>
//               <label>
//                 Event Title:
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                 />
//               </label>
//               {/* Add more input fields for other event details */}
//               <button type="submit">Create Event</button>
//             </form>
//           </div>
//         );
//       }      


// export default EventFormCreator;