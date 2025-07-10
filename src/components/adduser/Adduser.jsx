import {useState} from 'react'
import './Adduser.scss'
import { collection, getDocs, where,query, doc, updateDoc, serverTimestamp,setDoc, arrayUnion,getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { userStore } from '../Stores/userStore'
export const Adduser=()=>{
    const {curruser}=userStore()
    const [user,setUser]=useState(null)
    const searchuser=async(e)=>{
        e.preventDefault()
        const fd=new FormData(e.target)
        const {username}=Object.fromEntries(fd)
        console.log(username)
        const usercoll=collection(db,"users")
        const q=query(usercoll,where("username","==",username))

        try{
            const userinfo=await getDocs(q)

            if(!userinfo.empty){setUser(userinfo.docs[0].data())}
            
        }
        catch(err){
            console.log(err)
        }
    }

    const adduser=async()=>{
        try{
            const chatscol=collection(db,"chats")

            const chatscolref=doc(chatscol)

            const userchatscol=collection(db,"userchats")

            await setDoc(chatscolref,{
                createdAt:serverTimestamp(),
                messages:[]
            })

            await updateDoc(doc(userchatscol,curruser.id),{
                chats:arrayUnion({
                    chatId:chatscolref.id,
                    receiverId:user.id,
                    lastmsg:"",
                    updatedAt:Date.now()
                })
            })

             await updateDoc(doc(userchatscol,user.id),{
                chats:arrayUnion({
                    chatId:chatscolref.id,
                    receiverId:curruser.id,
                    lastmsg:"",
                    updatedAt:Date.now()
                })
            })
        }
        catch(err){
            console.log(err)
        }
    }
    return(
        <div className="addusercon">
            <form onSubmit={searchuser}>
                <div className="adduserlcon">
                <input type="text" placeholder="Username" name="username"></input>
                <button>Search</button>
            </div>
            </form>
            {
                user && <div className="adduserrcon">
               <div className="adduserrcondet">
                 <img src={user?.img || "https://images.unsplash.com/photo-1727985622854-4f145fe7ecf6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGEzfGVufDB8fDR8fHwy"}></img>
                
                <div>{user.username}</div>
               </div>
                <div className="adduserbtn" onClick={adduser}>Add User</div>
            </div>
            }
        </div>
    )
}