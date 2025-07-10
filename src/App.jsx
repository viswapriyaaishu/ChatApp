import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import { List } from './components/List/List.jsx'
import { Chat } from './components/Chat/Chat.jsx'
import { Details } from './components/Details/Details.jsx'
import { Login } from './components/Login/Login.jsx'
import { Notification } from './components/Notification/Notification.jsx'
import { userStore } from './components/Stores/userStore.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './components/firebase.jsx'
import { useEffect } from 'react'
import { chatStore } from './components/Stores/chatStore.jsx'
function App() {
  const {chatId,chatfunc,resetchat}=chatStore()
const {curruser,isLoading,fetchUser}=userStore()

// useEffect(() => {
//    console.log("chatId changed:", chatId);
//  }, [chatId]);
useEffect(()=>{
  const unsub=onAuthStateChanged(auth,(user)=>{
    fetchUser(user?.uid)
    if(user){
      resetchat()
    }
    })
    return()=>{
      unsub()
    }
},[fetchUser])
if(isLoading){return <div className='loader'>Loading...</div>}
  return (
   <div className='maincon'>
{curruser?<div className="mainconwrap">
  <List></List>
 {chatId &&  <Chat></Chat>}
  {chatId && <Details></Details>}
</div>:<Login></Login>}
<Notification></Notification>
   </div>
  )
}

export default App
