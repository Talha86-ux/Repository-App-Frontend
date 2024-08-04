import React, { useState } from 'react'
import './userForms.css'
import config from '../../config'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import cogoToast from 'cogo-toast'
import { Link } from 'react-router-dom'
import { camelToSnake } from '../../utils/helpers'

export const SignUp = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState('Register Yourself!')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const apiUrl = process.env.NODE_ENV === 'production' ? config.production.apiUrl : config.development.apiUrl

  const submitSignUpRequest = ()=> {
    const SignupParams = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }
    const params = camelToSnake(SignupParams);

    axios.post(`${apiUrl}/api/v1/users`, params).then(res => {
      if (res.data.user){
        navigate("/dashboard")
        cogoToast.success("User registered successfully!")
        const current_user = res.data.user
        localStorage.setItem('user', JSON.stringify(current_user))
        return res.data.user
      }else{
        cogoToast.error("Couldn't create the user, please try again")
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  const submitLoginRequest = ()=> {
    const loginParams = {
      email: email,
      password: password
    }

    axios.post(`${apiUrl}/api/v1/sessions`, loginParams).then(res => {
      const current_user = res.data.user
      localStorage.setItem('user', JSON.stringify(current_user))
      if (res.data.error){
        cogoToast.error(res.data.error);
      }else {
        navigate("/dashboard");
        cogoToast.success(res.data.message);
      }
    })
    .catch(err => {
      console.log(err)
    })    
  }

  const handleRedirect = ()=> {
    navigate('forgot-password')
  }

  return (
    <div className='container'>
      <form>
        <div className='header'>
          <div className='text'>{action}</div>
        </div>
        <div className='inputs'>
          {action === 'Login' ? <div></div> : <div className='input'>
            <img src='' alt=''/>
            <input type='text' placeholder='First Name' onChange={(e)=>{setFirstName(e.target.value)}} />
          </div>}

          {action === 'Login' ? <div></div> : <div className='input'>
            <img src='' alt=''/>
            <input type='text' placeholder='Last Name' onChange={(e)=>{setLastName(e.target.value)}} />
          </div>}

          <div className='input'>
            <img src='' alt=''/>
            <input type='email' placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}} />
          </div>

          <div className='input'>
            <img src='' alt=''/>
            <input type='password' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} />
          </div>

          {action === 'Login' ? <div></div> : <div className='input'>
            <img src='' alt=''/>
            <input type='password' placeholder='Confirm password' onChange={(e)=>{setPasswordConfirmation(e.target.value)}} />
          </div>}
        </div>

        {action === 'Login' ? (
        <div className='forgot-password'>
          <Link to='/forgot-password'>Forgotten your Password?</Link>
          <button onClick={handleRedirect} style={{ display: 'none' }}></button>
        </div>
        ) : (
          <div></div>
        )}
        
        <div className='submit-container'>
          <div className= {action === 'Login' ? 'submit' : 'submit gray'} onClick = {()=>  {submitSignUpRequest(); setAction('Signup')}} >Sign Up</div>
          <div className={action === 'Signup' ? 'submit' : 'submit gray'} onClick = {()=> {submitLoginRequest(); setAction('Login')}}>Login</div>
        </div>
      </form>
    </div>
  )
}
