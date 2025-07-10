import {useState} from 'react'
import { toast } from 'react-toastify'
import './Login.scss'
import {db,auth} from '../firebase.jsx'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
import {getDoc,doc, setDoc} from "firebase/firestore"
import axios from "axios"
import { chatStore } from '../Stores/chatStore.jsx'
export const Login=()=>{
    const {chatId,chatfunc,resetchat}=chatStore()
    const [File,setFile]=useState(undefined)
    const [loading,setLoading]=useState(false)
    const loginbtnfunc=async(e)=>{
        e.preventDefault()
        setLoading(true)
        const fd1=new FormData(e.currentTarget)
        const {email,password}=Object.fromEntries(fd1)


       
        try{
            await signInWithEmailAndPassword(auth,email,password)
            
            toast.success("Successfully logged in")
            resetchat()
            console.log(chatId)
        }
        catch(err){
            console.log(err)
            toast.error("Incorrect credentials")
        }
        finally{
            setLoading(false)
        }
    }

    const regbtnfunc1=async(e)=>{
        e.preventDefault()
        setLoading(true)
        
        const fd2=new FormData(e.currentTarget)
        
        const {email,username,password}=Object.fromEntries(fd2)
        console.log(fd2)
        const fd3=new FormData()
        fd3.append("file",File)
        fd3.append("upload_preset","upload")
        try{
            const imgurl=await axios.post("https://api.cloudinary.com/v1_1/dlcimnrkc/image/upload",fd3)
            const {url}=imgurl.data
            const res=await createUserWithEmailAndPassword(auth,email,password)
            const usersinfo=await setDoc(doc(db,"users",res.user.uid),{
                username,
                email,
                avatar:url,
                id:res.user.uid,
                blocked:[]
            })
            
            const userchatsinfo=await setDoc(doc(db,"userchats",res.user.uid),{
                chats:[]
            })
            resetchat()
            toast.success("Successfully registered")
        }
        catch(err){
            toast.error(err.message)
        }
        finally{
            setLoading(false)
        }
    }

    const fileChoose=(e)=>{
        setFile(e.target.files[0])
    }

    return(
        <div className="loginout">
           
                <div className="loginlcon">
                    <div>Hello user,</div>
                <form onSubmit={loginbtnfunc}>
                    <input type="email" placeholder="Email" id='email' name="email"></input>
                    <input type="password" placeholder="Password" id='password' name="password"></input>
                    <button type="submit" disabled={loading}>{loading?"loading":"Sign In"}</button>
                </form>
                </div>
                <div className="sepcon"></div>
                <div className="rlogincon">
                    <div>Create an Account</div>
                  <form onSubmit={regbtnfunc1}>
                      <label htmlFor="fileimg"><img src={File?URL.createObjectURL(File):"https://images.unsplash.com/photo-1727985622854-4f145fe7ecf6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGEzfGVufDB8fDR8fHwy"}></img><p>Upload an Image</p></label>
                    <input type="file" id="fileimg" style={{display:"none"}} onChange={fileChoose}></input>
                    <input type="text" placeholder="username" name="username"></input>
                    <input type="email" placeholder="email" name="email"></input>
                    <input type="password" placeholder="Password" name="password"></input>  
                    <button type="submit" disabled={loading}>{loading?"loading":"Sign Up"}</button>
                  </form>
                </div>
           
        </div>
    )
}