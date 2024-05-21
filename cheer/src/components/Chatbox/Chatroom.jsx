import './Chatroom.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Chatroom(){
const [clientList, setClientList] = useState([]);
const [userName, setUserName] = useState('');
const [message, setMessage] = useState('');
const [divMessage, setDivMessage] = useState([]);
const [receiver, setReceiver] = useState('');
const email = localStorage.getItem('email');
const routerPath = `/api`;//beginning of routerPath for login
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; //using cors to connect the backend to the front end

// retrieve contact list
const getClientList = async () => {
    try {
        const response = await fetch(`${backendUrl}${routerPath}/clientList`, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        // exclude user's name as contact
        let clientEmail = data.email;
        let clientName = data.fullName;
        let list = []
        for(let i=0; i<clientEmail.length; i++){
        if  (clientEmail[i].email !== email){
            list.push(clientName[i].name);
        }
        }
        setClientList(list);
    } catch (error) {
        console.log('Error fetching data:', error);
    }
    };

    useEffect(() => {
        getClientList();
    }, []);

    // functions
    const getUser = () => {
        fetch(`${backendUrl}${routerPath}/login?email=${email}`,{
        headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        }
    })
      .then(res => res.json()
      .then(data => {
            setUserName(data.username);
      })
      .catch((error) => {
          console.log(error + " error from login data retrieval");//error msg if there is an error when retrieving the data
          })
      )
      .catch((err)=>{//error msg if there is an error reading the json from the backend
          console.log(err);
      })
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = () => {
        let msgList = divMessage;
        if(receiver !== ''  && message !== ''){
            const msgData = {
                sender: userName,
                receiver: receiver,
                message: message
            }
            fetch(`${backendUrl}${routerPath}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(msgData),
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to send message');
                }
            })
            .catch((err)=>{
                console.log(err);
            });
            msgList.push({message: message, type: "sender"});
            setDivMessage(msgList);
            setMessage('');
        }
    };

    // updates when receiver is updated
    useEffect(() => {
        getMessageLog();
    }, [receiver]);

    const getMessageLog = () => {
        let msgList = [];
        if(receiver !== ''){
            fetch(`${backendUrl}${routerPath}/chat?sender=${userName}&receiver=${receiver}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                for(let msgData of data){
                    if(msgData.sender === userName){
                        msgList.push({message: msgData.message, type: "sender"});
                    }
                    else{
                        msgList.push({message: msgData.message, type: "receiver"});
                    }
                }
                setDivMessage(msgList);
            })
            .catch(error => {
                console.log('Error with fetch operation:', error);
            });
        }
    };


    // handle real-time messaging
    useEffect(() => {
        // connect to websocket server
        const newWs = new WebSocket(`ws://${domainName}:8081`);;

        // handle incoming messages
        newWs.onmessage = getMessageLog;

        // close WebSocket connection when component unmounts
        return () => {
            newWs.close();
        };
    }, [receiver]); // preserve receiver value

    return(
        <>
            <div className='header'>
                <Link to='/main' className='link-to-main'>
                    <button className='back-button'>&larr;</button>
                </Link>
                <p className='name-header'>{userName}</p>
            </div>
            <div className='chatroom-body'>
                <div className='contacts'>
                    {clientList.map((client, index) => (
                        <>
                            <div className='client-list'>
                                <button className='client' onClick={() => {setReceiver(client);}}>
                                    <div key={index} value={client}>
                                        <p>{client}</p>
                                    </div>
                                </button>
                            </div>
                        </>
                    ))}
                </div>
                <div className='chatbox'>
                    <div className='messages'>
                        <p className='receiver-name'>{receiver}</p>
                        <div className='message-log'>
                            {divMessage.map((msg, index) => (
                                <>
                                    { msg.type === "sender" ? (
                                        <div key={index} value={msg.message} className='sent'>
                                            <p>{msg.message}</p>
                                        </div>
                                    ) : (
                                        <div key={index} value={msg.message} className='received'>
                                            <p>{msg.message}</p>
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                    </div>
                    <div className='inputbox'>
                        <input className="textbox" type='text' placeholder='Write a message...' value={message} onChange={handleMessageChange}></input>
                        <button className='send' onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chatroom;