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
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/v1/users');
        setUsers(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error with fetch', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const res = await axios.get('/api/v1/chatrooms');
        setChatrooms(res.data);
        setIsLoadingChatroom(false);
      } catch (error) {
        console.log('Error with fetch chatroom', error);
        setError(error);
      }
    };

    fetchChatrooms();
  }, []);

  useEffect(() => {
    if (currentChatroomId) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`/api/v1/chatrooms/${currentChatroomId}/messages`);
          setMessages(res.data);
          console.log("Fetched messages: ", res.data);
        } catch (error) {
          console.log('Error with fetch messages', error);
          setError(error);
        }
      };

      fetchMessages();

      const subscription = CableApp.cable.subscriptions.create(
        { channel: "ChatroomChannel", chatroom_id: currentChatroomId },
        {
          received: (data) => {
            console.log("Received data: ", data);
            if (data.message !== 'Channel Subscribed') {
              setMessages((prevMessages) => {
                const newMessages = [...prevMessages, data.message];
                console.log("Updated messages: ", newMessages);
                return newMessages;
              });
              scrollToBottom();
            }
          },
          sendMessage(message) {
            this.perform("send_message", message);
          },
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentChatroomId]);

  const scrollToBottom = () => {
    messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    if (currentChatroomId) {
      CableApp.cable.subscriptions.subscriptions[0].perform("send_message", {
        user_id: user.id,
        recipient_id: recipientId,
        chatroom_id: currentChatroomId,
        content: newMessage,
      });

      setNewMessage("");
    } else {
      alert("Please select a chatroom.");
    }
  };

  const handleChatroomChange = (e) => {
    setCurrentChatroomId(e.target.value);
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (isLoadingChatroom) {
    return <p>Loading chatrooms...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  return (
    <div>
      <section>
        <button onClick={handleNavigate}>Create a new Chatroom</button>
      </section>
      <section>
        <div className="chat-container">
          <label className="LabelClass">Select a Chatroom:</label>
          <select
            className="selectClass"
            value={currentChatroomId}
            onChange={handleChatroomChange}
          >
            <option value="" disabled>Select a Chatroom</option>
            {chatrooms.map((chatroom) => (
              <option key={chatroom.id} value={chatroom.id}>{chatroom.name}</option>
            ))}
          </select>

          <div className="message-list" ref={messageListRef}>
            {messages.map((message, index) => (
              <div key={message.id || index} className="message">
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
            <button className="submitButtonClass" type="submit">Send</button>
          </form>
        </div>
      </section>
    </div>
  );
};
