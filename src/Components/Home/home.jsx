import React from 'react';
import { useNavigate } from 'react-router-dom';
export const Home = () => {
  const userDetails = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleNavigate = () => { navigate('/chatroom'); };

  const logout = ()=>{
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <div>
      <h5>Welcome to the Dashboard</h5>
      <h3>Hello {userDetails.first_name} {userDetails.last_name}!</h3>
      <p>Your Email address is: <span className="user-details">{userDetails.email}</span></p>
      <div>
        <button onClick={handleNavigate}>Chat</button>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}