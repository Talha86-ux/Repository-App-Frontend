import './App.css';
import { SignUp } from './Components/UserForms/SignUp';
import { Chatroom } from './Components/Chatroom/chatroom';

function App() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <SignUp/>
      <Chatroom user={currentUser} />
    </div>
  );
}

export default App;
