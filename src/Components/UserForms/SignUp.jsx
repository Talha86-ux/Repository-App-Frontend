import React, { useState } from 'react'
import './userForms.css'
import config from '../../config'
import axios from 'axios'

export const SignUp = () => {

  const [action, setAction] = useState('Signup')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  function camelToSnake(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.replace(/([A-Z])/g, "_$1").toLowerCase()] = obj[key];
      return acc;
    }, {});
  }

  const submitSignUpRequest = ()=> {
    const apiUrl = process.env.NODE_ENV === 'production' ? config.production.apiUrl : config.development.apiUrl;
    const SignupParams = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }
    const params = camelToSnake(SignupParams);

    axios.post(`${apiUrl}/api/v1/users`, params).then(res => {
      return res.data.user
    })
    .catch(err => {
      console.log(err)
    })
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

        {action === 'Login' ? <div className='forgot-password'>Forgot Password? <span>Click Here!</span></div> : <div></div> }
        
        <div className='submit-container'>
          <div className= {action === 'Login' ? 'submit' : 'submit gray'} onClick = {(e)=>  {submitSignUpRequest(e); setAction('Signup')}} >Sign Up</div>
          <div className={action === 'Signup' ? 'submit' : 'submit gray'} onClick = {()=> {setAction('Login')}}>Login</div>
        </div>
      </form>
    </div>
  )
}
