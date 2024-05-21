import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Password } from '../Password/Password';
import background from './cheergroup.png';

const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clientChosen, setChosenClient] = useState(false);
    const [otherChosen, setOtherChosen] = useState(false);
    const [msg, setMsg] = useState('');
    const [clientPassword, setClientPassword] = useState([]);
    const routerPath = `/api`;
    const navigate = useNavigate();

    const authenticate = () => {
        if (clientChosen) {
            checkCredentials(email, clientPassword.join());
        } else {
            checkCredentials(email, password);
        }
    };

    const checkCredentials = (enteredEmail, enteredPassword) => {
        var requestBody = {
            email: `${enteredEmail}`,
            password: `${enteredPassword}`,
        };
        fetch(`${backendUrl}${routerPath}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(res => res.json()
            .then(data => {
                for(let dataV in data){
                    if(dataV === "data"){//if it is the token
                        localStorage.setItem("token", data[dataV]);//place the token value inside local storage
                        localStorage.setItem("email",email);
                    }
                    if(dataV === "message"){//displaying the message returned by the backend to notify the user
                         if(data[dataV] === "logged in successfully"){
                            localStorage.setItem('email', enteredEmail);
                            navigate('/main');
                         }
                        setMsg(data[dataV]);//setting that msg to be displayed
                    }
                }})
            )
            .catch((error) => {
                console.log(error + ' error from login data retrieval');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePasswordChange = (newPassword) => {
        if (newPassword !== clientPassword) {
            setClientPassword(newPassword);
        }
    };

    return (
        <div id="login">
            <div className="login-page-container">
                <div className="login-background-image-container">
                    <img src={background} alt="Background" />
                </div>
                <div className="login-container container">
                    <div className="login-header">
                        <h1 class="login-text">LOGIN</h1>
                        <div className="login-account-select-container-login">
                            <button className="login-btn-client-account" onClick={() => { setChosenClient(true); setOtherChosen(false); }}>
                                Client Account
                            </button>
                            <button className="login-btn-other-account" onClick={() => { setChosenClient(false); setOtherChosen(true); }}>
                                Other Account
                            </button>
                        </div>
                    </div>
                    <div className="login-input-container input-container">
                        {otherChosen && (
                            <>
                                <div className="login-email-input">
                                    <input className="login-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                </div>
                                <div className="login-password-input">
                                    <input className="login-input-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                </div>
                            </>
                        )}
                        {clientChosen && (
                            <>
                                <div className="login-email-input">
                                    <input className="login-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                </div>
                                <div>
                                    <Password onPasswordChange={handlePasswordChange} />
                                </div>
                            </>
                        )}
                    </div>
                    <button className="login-signin-btn" onClick={authenticate}>Sign in</button>
                    <div className="msg-container">{msg}</div>
                    <p>Don't have an account? <Link to="/signup">Signup</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;