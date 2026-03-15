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
            if (data.message !== 'Channel Subscribed') {
              setMessages((prevMessages) => {
                const newMessages = [...prevMessages, data.message];
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
    <div className="chat-parent-wrapper">
      <header className="chat-header">
        <h2>Team Chatroom</h2>
        <button className="chat-primary-button" onClick={handleNavigate}>+ New Chatroom</button>
      </header>

      <div className="chat-container">
        <div className="chat-sidebar">
          <label className="label">Select a Chatroom</label>
          <select
            className="select"
            value={currentChatroomId}
            onChange={handleChatroomChange}
          >
            <option value="" disabled>Select a Chatroom</option>
            {chatrooms.map((chatroom) => (
              <option key={chatroom.id} value={chatroom.id}>{chatroom.name}</option>
            ))}
          </select>

          <label className="label">Send To</label>
          <select
            className="select"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          >
            <option value="" disabled>Select a user</option>
            {users.map((userItem) => (
              <option key={userItem.id} value={userItem.id}>{userItem.first_name}</option>
            ))}
          </select>
        </div>

        <main className="chat-main">
          <div className="message-list" ref={messageListRef}>
            {messages.map((message, index) => {
              const isOwn = message?.user?.id === user?.id;
              return (
                <div key={message.id || index} className={`message ${isOwn ? 'own-message' : 'other-message'}`}>
                  <div className="message-meta">
                    <span className="message-author">{message?.user?.first_name || 'Unknown'}</span>
                    <span className="message-time">{message.created_at ? new Date(message.created_at).toLocaleTimeString() : ''}</span>
                  </div>
                  <div className="message-body">{message.body}</div>
                </div>
              );
            })}
          </div>

          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              className="message-input"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
            />
            <button className="send-button" type="submit">Send</button>
          </form>
        </main>
      </div>
    </div>
  );
};
