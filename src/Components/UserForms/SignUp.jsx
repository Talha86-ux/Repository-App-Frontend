import React, { useState } from 'react'
import './userForms.css'
import config from '../../config'
import axios from 'axios'

export const SignUp = () => {

  const [action, setAction] = useState('Signup')

  const submitSignUpRequest = ()=> {
    const apiUrl = process.env.NODE_ENV === 'production' ? config.production.apiUrl : config.development.apiUrl;

    axios.post(`${apiUrl}/api/v1/users`).then(res => {
      console.log('Response from API:', res)
    })
    .catch(err => {
      console.log("Error: ", err)
    })
  }

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
      </div>
      <div className='inputs'>
        {action === 'Login' ? <div></div> : <div className='input'>
          <img src='' alt=''/>
          <input type='text' placeholder='First Name' />
        </div>}

        {action === 'Login' ? <div></div> : <div className='input'>
          <img src='' alt=''/>
          <input type='text' placeholder='Last Name' />
        </div>}

        <div className='input'>
          <img src='' alt=''/>
          <input type='email' placeholder='Email' />
        </div>

        <div className='input'>
          <img src='' alt=''/>
          <input type='password' placeholder='Password' />
        </div>
      </div>

      {action === 'Login' ? <div className='forgot-password'>Forgot Password? <span>Click Here!</span></div> : <div></div> }
      
      <div className='submit-container'>
        <div className= {action === 'Login' ? 'sumbit' : 'submit gray'} onClick = {()=> {setAction('Signup')}} onSubmit={action === 'Signup' ? submitSignUpRequest() : null}>Sign Up</div>
        <div className={action === 'Signup' ? 'sumbit' : 'submit gray'} onClick = {()=> {setAction('Login')}} onSubmit={action === 'Login' ? submitLoginRequest() : null}>Login</div>
      </div>
    </div>
  )
}
