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
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false)
  const [resetPasswordToken, setResetPasswordToken] = useState('')
  const apiUrl = process.env.NODE_ENV === 'production' ? config.production.apiUrl : config.development.apiUrl
  
  const verifyUserEmailRequest = () => {
    const findUserParams = {
      email: email
    }

    axios.post(`${apiUrl}/api/v1/forgot-password`, findUserParams).then(res => {
      if (res.data){
        setShowResetPasswordForm(true)
        setResetPasswordToken(res.data.reset_token)
      }else {
        cogoToast.error("Couldn't find the user with this email.")
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
  const UpdatePasswordRequest = () => {
    const newPasswordParams = {
      password: password,
      passwordConfirmation: passwordConfirmation,
      resetPasswordToken: resetPasswordToken
    }
    const params = camelToSnake(newPasswordParams);

    axios.post(`${apiUrl}/api/v1/update-password`, params).then(res => {
      if (res.data){
        console.log("UPdated password: ", res.data)
        navigate("/dashboard")
        cogoToast.success("Password updated successfully!")
        const current_user = res.data.user
        localStorage.setItem('user', JSON.stringify(current_user))
        localStorage.setItem("jwt", res.data.jwt)
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
      {!showResetPasswordForm ? ( <form style={{textAlign: 'center'}} onSubmit={(e) => { e.preventDefault(); verifyUserEmailRequest();}}>
          <div className='input'>
            <img src='' alt=''/>
            <input type='email' placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}} />
          </div>
          <button type='submit'>Verify Email</button>
        </form>
        ) : (
          <form onSubmit={(e) => {e.preventDefault(); UpdatePasswordRequest();}}>
          <div className='input'>
            <img src='' alt=''/>
            <input type='password' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} />
          </div>

          <div className='input'>
            <img src='' alt=''/>
            <input type='password' placeholder='Confirm password' onChange={(e)=>{setPasswordConfirmation(e.target.value)}} />
          </div>

          <div className='submit-container'>
            <button className='passwordChange' type='submit'>Update password</button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}