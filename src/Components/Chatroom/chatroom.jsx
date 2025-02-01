import React, { useState, useEffect, useRef, useCallback } from "react";
import CableApp from '../../utils/cable'
import axios from 'axios'
import _ from 'lodash';
import './chatroom.css'

export const Chatroom = ({user}) => {
  // const [chatroomId, setChatroomId] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   axios.post('/api/v1/chatrooms', {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ user_id: user.id })
  //   }).then(res => {
  //     if (!res.ok) {
  //       console.log('Error with response', res);
  //     }
  //     return res.json();
  //   })
  //   .then(data => {
  //     if (data.id) {
  //       setChatroomId(data.id);
  //     } else {
  //       console.log('Chatroom creation failed');
  //     }
  //   }).then((error) => {
  //     console.log('Error with fetch', error);
  //     setIsLoading(false);
  //   })
  // }, [user.id]);

  
  useEffect(() => {
    const subscription = CableApp.cable.subscriptions.create(
      { channel: "ChatroomChannel" },
      {
        received: (data) => {
          setMessages((prevMessages) => [...prevMessages, data.message]);
          scrollToBottom();
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUsers = useCallback(_.debounce(() => {
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
    }, 600), []);

  useEffect(() => {
    fetchUsers();
    }, [fetchUsers]);


  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
      return <p>Error fetching users: {error.message}</p>;
  }

  console.log('users', users);

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
      content: newMessage,
    });

    setNewMessage("");
  }

  return (
    <div className="chat-container">
  <div className="message-list" ref={messageListRef}>
    {messages.map((message, index) => (
      <div key={index} className="message">
        <strong>{message.user.name}:</strong> {message.content}
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
      <option value="" disabled>
        Select a user
      </option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.first_name} {user.last_name}
        </option>
      ))}
    </select>
    <button className="submitButtonClass" type="submit">
      Send
    </button>
  </form>
</div>
  );
}
