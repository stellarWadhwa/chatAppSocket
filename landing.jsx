import React, {useEffect, useState} from 'react'
import io from "socket.io-client"
import Chat from '../chat/chat';
import axios from "axios";
import ModalServer from '../modal/modal';





function Landing() {


  const [socket, SetSocket]=useState('');
  const [showModal,setShowModal] = useState(false);
  let apiCall;
  const fetch=async()=>{
 
   
    apiCall=await io.connect('http://localhost:3001/');
    SetSocket(apiCall)
    }

    const checkServerStatus = async () => {
      
      try {
        // Create a promise for the axios request
        const axiosPromise = axios.get('https://chattt-app.onrender.com/server');
    
        // Create a promise that resolves after 5 seconds
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, 5000); // Timeout after 5 seconds
        });
    
        // Race the axios request promise against the timeout promise
        const res = await Promise.race([axiosPromise, timeoutPromise]);
    
        if (res.status === 200) {
            fetch();
        } else {
            console.log("error");
        }
    } catch (error) {
        if (error.message === 'Request timed out') {
            console.error('Request timed out:', error);
            setShowModal(true); // Show modal if request times out
        } else {
            console.error('Request error:', error);
        }
    }
    }
  useEffect(()=>{
checkServerStatus();
  },[])


  const  [name,setName]=useState("");
  const [room,setRoom]=useState("");
  const [showChat,setShowChat]=useState(false);
  const submitbutton=async()=>{


    if(name!="" && room!=""){
      socket.emit("join_room",(room))
      setShowChat(true);
    }
  }
  return (
    <>
     {showModal && <ModalServer />}
    {!showChat ? (




    <div className="joinChatContainer">
    <h3>Join A Chat</h3>
      <input className="jccInput" type="text" placeholder="name"  onChange={(e)=>{
        setName(e.target.value);
      }} required/>
      <input className="jccInput" type="text" placeholder="room" required onChange={(e)=>{
        setRoom(e.target.value);
      }} />
      <button onClick={submitbutton}
      >Join</button>
    </div>
    ):(


    <Chat socket={socket}  username={name} room={room}/>
    )
    }
    </>
  )
}


export default Landing
