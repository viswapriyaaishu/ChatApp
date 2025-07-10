import '../List/List.scss'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VideocamIcon from '@mui/icons-material/Videocam';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { useState } from 'react';
import { Adduser } from '../adduser/Adduser';
import { userStore } from '../Stores/userStore.jsx';
import { db } from '../firebase.jsx';
import { onSnapshot,collection,doc,getDoc, updateDoc } from 'firebase/firestore';
import { chatStore } from '../Stores/chatStore.jsx';
import { useEffect } from 'react';

export const List=()=>{

    const {chatfunc,isCurrUserBlocked,isReceiverBlocked}=chatStore()
   
    const {curruser}=userStore()
    const [searchfield,setSearchfield]=useState("")
    const [addopen,setAddopen]=useState(true)
    const [userchats,setUserchats]=useState([])
    
     const handleclick=async(chat)=>{
        try{
            console.log(chat.chatId)
        chatfunc(chat.userinf,chat.chatId)

        const chatsinfo=userchats.map((uchat)=>{
            const {userinf,...rem}=uchat
            return rem
        })
        const ind=chatsinfo.findIndex(c1=>c1.chatId==chat.chatId)
        chatsinfo[ind].isSeen=true
        await updateDoc(doc(db,"userchats",curruser.id),{
            chats:chatsinfo
        })
        }

        catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        const unsub=onSnapshot(doc(db,"userchats",curruser.id),async(res)=>{
                const info=res.data().chats 
                console.log(info)
                const promises=info.map(async(if1)=>{
                    const usersdet=await getDoc(doc(db,"users",if1.receiverId))
                    const userinf=usersdet.data()
                    return {...if1,userinf}
                })

                const userres=await Promise.all(promises)
                console.log(userres)
                setUserchats(userres.sort((a,b)=>b.updatedAt-a.updatedAt))
            })
            
           
        

        return ()=>{unsub()}
    },[curruser.id])
    const filteredchats=userchats.filter((it)=>it.userinf.username.toLowerCase().includes(searchfield.toLowerCase()))
        
    
    return(
        <div className="listcon">
            <div className="userdet">
                <div className="userinfo">
                    <img src={curruser?.avatar ||'https://i.pinimg.com/280x280_RS/5d/b8/db/5db8db18ce5e9f0969f894dc24d377ac.jpg'}></img>
                <p>{curruser?.username}</p>
                </div>
                <div className="icons">
                    <div className="icon"><MoreHorizIcon></MoreHorizIcon></div>
                <div className="icon"><VideocamIcon></VideocamIcon></div>

                <div className="icon"><NoteAltOutlinedIcon></NoteAltOutlinedIcon></div>
                </div>
            </div>

            <div className="ipsearch">
                <div className="ipsearchtext">
                    <div className="icon"><SearchOutlinedIcon></SearchOutlinedIcon></div>
                <input type='text' placeholder='search' onChange={(e)=>(setSearchfield(e.target.value))}></input>
                </div>

                <div className="icon1" style={{backgroundColor:"rgba(17,25,40,0.5)"}}>{addopen ?<AddOutlinedIcon onClick={()=>setAddopen(prev=>!prev)}></AddOutlinedIcon>:<RemoveOutlinedIcon onClick={()=>setAddopen(prev=>!prev)}  ></RemoveOutlinedIcon>}</div>
            </div>

            <div className="chatsmessages">{filteredchats.map((it)=>(<div key={it?.chatId} className={it.isSeen?"normal justcon":"bluey justcon"} style={{cursor:"pointer"}} onClick={()=>handleclick(it)}><div className="justconwrap"><div className="lcon"><img src={curruser.blocked.includes(it.userinf.id)?"https://previews.123rf.com/images/lililia/lililia1711/lililia171100462/90661589-vector-flat-icon-of-user-on-black-background.jpg":it?.userinf.avatar} alt="no img" className='icon'></img></div> <div className="rcon"><div style={{fontSize:'18px',fontWeight:600}}>{curruser.blocked.includes(it.userinf.id) ?"user":it?.userinf.username}</div><div>{it.lastmsg}</div></div></div></div>))}</div>

            {!addopen && <Adduser></Adduser>}
        </div>
    )
}