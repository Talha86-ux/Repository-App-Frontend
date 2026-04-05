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

  return (
    <div className="chatroom-wrapper">
      <h2 className="chatroom-title">Create Chatroom</h2>
      <button className="chatroom-button back-button" onClick={() => navigate(-1)} aria-label="Go back">←</button>
      <form className="chatroom-form" onSubmit={handleSubmit}>
        <input
          className="chatroom-input"
          type="text"
          value={chatroomName}
          onChange={(e) => setChatroomName(e.target.value)}
          placeholder="Chatroom Name"
          aria-label="Chatroom Name"
        />
        <button className="chatroom-button" type="submit">Create</button>
      </form>
    </div>
  );
};
