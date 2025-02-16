import React, { useState } from "react";
import axios from 'axios';
import cogoToast from 'cogo-toast'
import { useNavigate } from 'react-router-dom';


export const Chatroom = () => {
  const [chatroomName, setChatroomName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [chatrooms, setChatrooms] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/v1/chatrooms', { chatroom: { name: chatroomName } })
      .then(res => {
        console.log(res.data);
        if (res.status === 201){
          alert()
          setChatrooms((prevChatrooms) => [...prevChatrooms, res.data]);
          setChatroomName("");
          navigate("/chat")
          cogoToast.success(res.data.message);
        }else{
          cogoToast.error(res.data.error);
        }
      }).catch(error => console.log('Error with fetch', error));
  };

  return(
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={chatroomName}
        onChange={(e) => setChatroomName(e.target.value)}
        placeholder="Chatroom Name"
      />
      <button type="submit">Create Chatroom</button>
    </form>
  )

};
