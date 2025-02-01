import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CableProvider } from './context/cable';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUp } from './Components/UserForms/SignUp';
import { Home } from './Components/Home/home';
import { Header} from './Components/header';
import { Footer } from './Components/Footer/footer';
import { ForgotPassword } from './Components/ForgotPassword/ForgotPassword';
import { Chatroom } from './Components/Chatroom/chatroom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="register" element={<SignUp />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="forgot-password" element={<ForgotPassword/>} />
        <Route path="/chatroom" element={<Chatroom />} />
      </Routes>
    </BrowserRouter>
    <Footer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
