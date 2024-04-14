export const Home = () => {
  const userDetails = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <h5>Welcome to the Dashboard</h5>
      <h3>Hello {userDetails.first_name} {userDetails.last_name}!</h3>
      <p>Your Email address is: <span className="user-details">{userDetails.email}</span></p>
      <button>Logout</button>
    </div>
  );
}