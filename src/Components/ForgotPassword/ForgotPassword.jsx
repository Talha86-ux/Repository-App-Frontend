import React, { useState } from 'react'
import config from '../../config'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import cogoToast from 'cogo-toast'
import { camelToSnake } from '../../utils/helpers'

export const ForgotPassword = () =>{
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const apiUrl = process.env.NODE_ENV === 'production' ? config.production.apiUrl : config.development.apiUrl

  const submitUpdatePasswordRequest = () => {
    const newPasswordParams = {
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }
    const params = camelToSnake(newPasswordParams);

    axios.post(`${apiUrl}/`, params).then(res => {
      if (res.data.user){
        navigate("/dashboard")
        cogoToast.success("Password updated successfully!")
        const current_user = res.data.user
        localStorage.setItem('user', JSON.stringify(current_user))
        return res.data.user
      } else {
        cogoToast.error("Couldn't update the password, please try again")
      }
    })
    .catch(err => {
      console.log(err)
    })


  }

  return(
    <div>
      <button className='back-button' onClick={ ()=> navigate(-1) }>Back</button>
      <div className='container' >
        <form>
          <div className='input'>
            <img src='' alt=''/>
            <input type='email' placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}} />
          </div>

          <div className='input'>
            <img src='' alt=''/>
            <input type='password' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} />
          </div>

          <div className='input'>
            <img src='' alt=''/>
            <input type='password' placeholder='Confirm password' onChange={(e)=>{setPasswordConfirmation(e.target.value)}} />
          </div>

          <div className='submit-container'>
            <button className='passwordChange' onClick = {()=>  {submitUpdatePasswordRequest()}} >Update password</button>
          </div>
        </form>
      </div>
    </div>
  )
}