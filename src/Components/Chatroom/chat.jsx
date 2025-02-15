import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import CableApp from '../../utils/cable';
import axios from 'axios';
import './chat.css';

export const Chat = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [currentChatroomId, setCurrentChatroomId] = useState("");
  const [chatrooms, setChatrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChatroom, setIsLoadingChatroom] = useState(true);
  const [error, setError] = useState(null);

  const handleNavigate = () => { navigate('/chatroom'); };

  useEffect(() => {
    const subscription = CableApp.cable.subscriptions.create(
      { channel: "ChatroomChannel" },
      {
        received: (data) => {
          console.log("Received data: ", data); 
          setMessages((prevMessages) => [...prevMessages, data.message]);
          // scrollToBottom();
        },
        sendMessage(message) {
          this.perform("send_message", message);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    axios.get('/api/v1/users')
      .then(res => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('Error with fetch', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get('/api/v1/chatrooms')
      .then(res => {
        setChatrooms(res.data);
        setIsLoadingChatroom(false);
      })
      .catch(error => {
        console.log('Error with fetch chatroom', error);
        setError(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`/api/v1/messages/`)
      .then(res => {
        setMessages(res.data);
      })
      .catch(error => {
        console.log('Error with fetch messages', error);
        setError(error);
      });
  }, []);

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (isLoadingChatroom) {
    return <p>Loading chatrooms...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  const scrollToBottom = () => {
    messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    CableApp.cable.subscriptions.subscriptions[0].perform("send_message", {
      user_id: user.id,
      recipient_id: recipientId,
      chatroom_id: currentChatroomId,
      content: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div>
      <section>
        <button onClick={handleNavigate}>Create a new Chatroom</button>
      </section>
      <section>
        <div className="chat-container">
          <div className="message-list" ref={messageListRef}>
            {messages.map((message, index) => (
              <div key={index} className="message">
                <strong>{message?.user?.first_name}:</strong> {message.body}
              </div>
            ))}
          </div>

          <form className="message-form" onSubmit={handleSendMessage}>
            <label className="LabelClass">Write Message:</label>
            <input
              className="inputClass"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <label className="LabelClass">Send To:</label>
            <select
              className="selectClass"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            >
              <option value="" disabled>Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.first_name}</option>
              ))}
            </select>
            <label className="LabelClass">Chatroom:</label>
            <select
              className="selectClass"
              value={currentChatroomId}
              onChange={(e) => setCurrentChatroomId(e.target.value)}
            >
              <option value="" disabled>Select a Chatroom</option>
              {chatrooms.map((chatroom) => (
                <option key={chatroom.id} value={chatroom.id}>{chatroom.name}</option>
              ))}
            </select>
            <button className="submitButtonClass" type="submit">Send</button>
          </form>
        </div>
      </section>
    </div>
  );
};
