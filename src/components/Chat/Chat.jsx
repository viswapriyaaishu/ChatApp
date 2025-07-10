import '../Chat/Chat.scss'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import {useState,useRef,useEffect} from 'react'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MicIcon from '@mui/icons-material/Mic';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiPicker from "emoji-picker-react"
import { div } from 'framer-motion/client';
import { chatStore } from '../Stores/chatStore';
import { onSnapshot ,doc, arrayUnion, updateDoc,getDoc} from 'firebase/firestore';
import { db } from '../firebase';
import { userStore } from '../Stores/userStore';
import axios from "axios"
export const Chat=()=>{
    const {curruser}=userStore()
    const {user,chatId}=chatStore()
    const [ip,setIp]=useState("")
    const[openemoji,setOpenemoji]=useState(false)
    const [chatmsgs,setChatmsgs]=useState([])
    const[imgs,setImgs]=useState(null)
    const {isReceiverBlocked,isCurrUserBlocked}=chatStore()
    const handleipimg=(e)=>{
        setImgs(e.target.files)
    }
    const handleemoji=(e)=>{
        setIp((prev)=>(prev+e.emoji))
        setOpenemoji(false)
    }
    
    const usermsgs=[
        {
            id:1,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"This is chat 1",
            created:"1 min ago",
            type:"othermsg"
        },
        {
            id:2,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"This is chat 2",
            created:"1 min ago",
            type:"othermsg"
        },
        {
            id:3,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"This is chat 3",
            created:"1 min ago",
            type:"usermsg"
        },
        {
            id:4,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"This is chat 4",
            created:"1 min ago",
            type:"othermsg"
        },
        {
            id:5,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore incidunt, asperiores non nesciunt amet pariatur inventore in illum culpa modi aperiam harum, ad dolorum deserunt fugit dolores repellendus ipsa quis recusandae numquam?",
            created:"1 min ago",
            type:"usermsg",
            opimg:"https://static.vecteezy.com/system/resources/thumbnails/049/855/347/small_2x/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-photo.jpg"
        },
        
        {
            id:6,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"This is chat 6",
            type:"usermsg",
            created:"1 min ago",
            opimg:"https://assets.weforum.org/article/image/0ZUBmNNVLRCfn3NdU55nQ00UF64m2ObtcDS0grx02fA.jpg"
        },
         {
            id:7,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus possimus quisquam inventore nesciunt, temporibus, officia maiores veniam consequatur libero voluptates quia sit modi magni perferendis molestias. Iure modi sint placeat ea illo.",
            created:"1 min ago",
            type:"othermsg"
        },
        {
            id:8,
            img:"https://asta.teresas.ac.in/wp-content/uploads/2018/01/Asin-e1702733061505.webp",
            msg:"This is chat 6",
            created:"1 min ago",
            type:"usermsg"
        }
    ]
    const handlesub=async()=>{
        if(ip==""){
            return;
        }

        try{
            
           const li1= (imgs ? await Promise.all(Object.values(imgs).map(async(img)=>{
                const fd1=new FormData()
                fd1.append("file",img)
                fd1.append("upload_preset","upload")

                const imgpost=await axios.post("https://api.cloudinary.com/v1_1/dlcimnrkc/image/upload",fd1)
                const {url}=imgpost.data
                return url
            })):[])
            const chatsdb=await updateDoc(doc(db,"chats",chatId),{
                messages:arrayUnion({
                    text:ip,
                    senderId:curruser.id,
                    ...(li1 && li1.length>0  && {imgs:li1}),
                    createdAt:new Date()
                })
            })
            
            const idarr=[user.id,curruser.id]
            idarr.map(async(id1)=>{
                const userchatsdb=await getDoc(doc(db,"userchats",id1))
                if(userchatsdb.exists()){
                    const userchatsdb1=userchatsdb.data()
                    const chatind=userchatsdb1.chats.findIndex(c1=>c1.chatId==chatId)
                userchatsdb1.chats[chatind].lastmsg=ip
                userchatsdb1.chats[chatind].isSeen=id1===curruser.id?true:false
                userchatsdb1.chats[chatind].updatedAt=Date.now()

            await updateDoc(doc(db,"userchats",id1),{
                chats:userchatsdb1.chats
            })
                }
            })
                
                


        }
        catch(err){
            console.log(err)
        }
        finally{
            setImgs(null)
            setIp("")
        }
    }
    const chatref=useRef()

    useEffect(()=>{chatref?.current.scrollIntoView({behavior:"smooth"})},[])

    useEffect(()=>{
        const unsub=onSnapshot(doc(db,"chats",chatId),(res)=>{
            setChatmsgs(res.data().messages)
        })

        return ()=>{unsub()}
    },[chatId])
    return(
        <div className="chatcon">
            <div className="chatcon1">
                <div className="chatconwrap">
                <div className="lchatcon">
                    <div ><img className="icon" src={!isReceiverBlocked ? user?.avatar:'https://previews.123rf.com/images/lililia/lililia1711/lililia171100462/90661589-vector-flat-icon-of-user-on-black-background.jpg'}></img></div>

                    <div className="lchatdet">
                        <div> {!isReceiverBlocked?user.username:"user"} </div>
                        <div>Always Busy</div>
                    </div>
                </div>

                <div className="rchatcon">
                    <div className="icon"><LocalPhoneIcon></LocalPhoneIcon></div>
                    <div className="icon"><VideocamIcon></VideocamIcon></div>
                    <div className="icon"><InfoOutlineIcon></InfoOutlineIcon></div>
                </div>
            </div>
            </div>

            <div className="chatcon2">{chatmsgs.map((obj)=>(
                <div key={obj.createdAt} className={`${obj.senderId==curruser.id?"usermsg":"othermsg"} lpar`}>
                    <div className="lobj">{obj.senderId!=curruser.id && <img src={user?.avatar}></img> }
                      <div className={`mobj ${obj.senderId==curruser.id ? "mobjc1":"mobjc2"} `}><div className="imgsubpar usermsg"><div style={{marginRight:"0px"}}>{obj?.imgs ? obj.imgs.map((img1=><div style={{marginRight:'0px'}}><img src={img1} alt="" style={{height:"60%",width:"100%",borderRadius:"10px",paddingRight:'0px',marginRight:'0px'}}></img></div>)) :""}</div>
                        <div className={`mmobj ${obj.senderId==curruser.id?"usertext":"othertext"}`}>{obj.text}</div> <div className="robj">{obj?.createdAt.toDate().toLocaleString().split(',')[1]}</div></div></div></div>
                    
                </div>
            ))}
            <div ref={chatref}></div>
            </div>
            <div className="chatcon3">
                <div className="chatcon3icons">
                    <InsertPhotoIcon></InsertPhotoIcon>
                    <label htmlFor="mulimg"><CameraAltIcon></CameraAltIcon></label>
                    <input type="file" multiple onChange={handleipimg} style={{display:"none"}} id="mulimg" disabled={isReceiverBlocked || isCurrUserBlocked}></input>
                    <MicIcon></MicIcon>
                </div>
                <input type="text" value={ip} onChange={(e)=>setIp(e.target.value)} disabled={isReceiverBlocked || isCurrUserBlocked} className={`${(isReceiverBlocked || isCurrUserBlocked)?"textblock":"textunblock"}`} placeholder={isReceiverBlocked ?"You cannot type anything":"Type"}></input>
                <div className="icon2" ><SentimentSatisfiedAltIcon onClick={()=>{setOpenemoji(prev=>!prev)}}></SentimentSatisfiedAltIcon>
                <div className="emojiclass"><EmojiPicker open={openemoji} onEmojiClick={handleemoji} className='emojichild'></EmojiPicker></div></div>
               <button className='sendbtn' onClick={handlesub}>Send</button>
            </div>
        </div>
    )
}