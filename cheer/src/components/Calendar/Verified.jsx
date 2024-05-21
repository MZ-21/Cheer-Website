import React, {useEffect} from 'react'

const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL
const path_frontend = `${window.origin}`

function Verified() {
    console.log("verified is begin called");
  
useEffect(() =>{
    console.log("this is being called")
    const authorizationCode = getParameterByName('code');
    console.log("authorization code", authorizationCode);
    if(authorizationCode){
      SignedIn(authorizationCode);
    };  
    
});

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  
  const SignedIn = (code) => {
    var email_user = localStorage.getItem('email');
    console.log("this is the email of the user", email_user);
    fetch(`${backendUrl}/api/google/redirect?code=${code}&emailuser=${email_user}`)
    .then(res => res.json()
    .then(data => {
      console.log(data.access_token.access_token);
      localStorage.setItem("google_token", data.access_token.access_token);

    })
    .catch(error => console.error('error returning data',error))
    )
    .catch(error => console.error(error));
  }

  
  return (
    <div className='calendar-verified'>
        <div className='calendar-verified-box'>
            <p>Verified Your Google Account!</p>
            <a href={`${path_frontend}/calendar`}>Click Here To Return To CHEER</a>

        </div>

    </div>
  )
}
export default Verified;