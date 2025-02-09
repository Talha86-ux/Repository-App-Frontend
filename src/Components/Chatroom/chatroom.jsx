import React, { useState } from "react";
import axios from 'axios';

export const Chatroom = () => {
  const [chatroomName, setChatroomName] = useState("");
  const [chatrooms, setChatrooms] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/v1/chatrooms', { chatroom: { name: chatroomName } })
      .then(res => {
        console.log(res.data);
        setChatrooms((prevChatrooms) => [...prevChatrooms, res.data]);
        setChatroomName("");
      })
      .catch(error => console.log('Error with fetch', error));
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
