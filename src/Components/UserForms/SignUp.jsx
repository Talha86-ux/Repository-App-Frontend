import React from 'react'
import './userForms.css'

export const SignUp = () => {
  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Sign Up</div>
      </div>
      <div className='inputs'>
        <div className='input'>
          <img src='' alt=''/>
          <input type='text' />
        </div>

        <div className='input'>
          <img src='' alt=''/>
          <input type='email' />
        </div>

        <div className='input'>
          <img src='' alt=''/>
          <input type='password' />
        </div>
      </div>
      <div className='forgot-password'>Forgot Password? 
        <span>Click Here!</span>
      </div>
      <div className='submit-container'>
        <div className='submit'>Register</div>
        <div className='submit'>Login</div>
      </div>
    </div>
  )
}
