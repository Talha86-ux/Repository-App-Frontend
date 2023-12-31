import React, { useState } from 'react'
import './userForms.css'

export const SignUp = () => {

  const [action, setAction] = useState('Signup')

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
        <div className= {action === 'Login' ? 'sumbit' : 'submit gray'} onClick = {()=> {setAction('Signup')}}>Sign Up</div>
        <div className={action === 'Signup' ? 'sumbit' : 'submit gray'} onClick = {()=> {setAction('Login')}}>Login</div>
      </div>
    </div>
  )
}
