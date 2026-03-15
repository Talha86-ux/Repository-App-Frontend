import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  const userDetailsJson = localStorage.getItem('user');
  const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;

  React.useEffect(() => {
    if (!userDetails) {
      navigate('/register');
    }
  }, [navigate, userDetails]);

  const handleNavigate = () => { navigate('/chat'); };

  const logout = () => {
    localStorage.clear();
    navigate('/register');
  }

  if (!userDetails) {
    return null; // redirect initiated
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