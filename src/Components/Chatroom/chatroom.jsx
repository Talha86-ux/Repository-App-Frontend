import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'


export const chatroom = () => {
  const [chatroomId, setChatroomId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.post('/api/v1/chatrooms', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: user.id })
    }).then(res => {
      if (!res.ok) {
        console.log('Error with response', res);
      }
      return res.json();
    })
    .then(data => {
      if (data.id) {
        setChatroomId(data.id);
      } else {
        console.log('Chatroom creation failed');
      }
    }).then((error) => {
      console.log('Error with fetch', error);
      setIsLoading(false);
    })
  }, [user.id]);

  
  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: 'ChatRoomChannel', chatroom_id: chatroomId },
      {
        connected: () => console.log('connected'),
        disconnected: () => console.log('disconnected'),
        received: (updatedChatroom) => {
      
            let message = updatedChatroom.message;
            let sender = updatedChatroom.sender;
 
 
            if (sender)
              message.username = sender;
 
 
            if (message) {
              setNewMessages((prevMessages) => {
                return [...prevMessages, message];
              });
            } else {
              message = { body: updatedChatroom.body, sender: "Server",
            }
          }         
        }
      }
    )
    return () => {
      subscription.unsubscribe();
      console.log("Cleanup chatroom")
    };
  }, [cable, chatroomId]);

  const handleSubmit = (e) => {
    
  }

  return (
    <div>
      {isLoading ? (
        <p>Creating chatroom...</p>
      ) : chatroomId ? (
        <div>
            <Chatroom chatroomId={chatroomId} />
        </div>) : (
        <p> Failed to create chatroom.</p>
      )}
    </div>
  );
}
