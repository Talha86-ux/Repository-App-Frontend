import React, { useContext, useState, useEffect } from 'react';
import { CableContext } from '../context/cable';

export const Greetings = ({user}) => {
  const [greeting, setGreeting] = useState('Hello world!')
  const cableContext = useContext(CableContext)
  console.log('cableContext', cableContext)

  // useEffect(() => {
  //   const newChannel = cableContext.cable.subscriptions.create(
  //   {
  //     channel: "ChatroomChannel",
  //     user_id: user.id
  //   },
  //   {
  //     // remember, the data being received and passed to the received
  //     // callback is an object structured like this:
  //     // { message: "some message" }
  //     received: (data) => setGreeting(data.message)
  //   })
  // }, [])
  // return <h1>{greeting}</h1>
}
