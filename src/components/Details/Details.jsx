import '../Details/Details.scss'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { auth, db } from '../firebase';
import { chatStore } from '../Stores/chatStore';
import { userStore } from '../Stores/userStore';
import { useState,useEffect } from 'react';
import { arrayUnion, doc, updateDoc,arrayRemove,getDoc, onSnapshot } from 'firebase/firestore';
export const Details=()=>{
   const [phodata,setPhodata]=useState([])
    const {user}=chatStore()
    const {chatfunc,isReceiverBlocked,isCurrUserBlocked,blockfunc,chatId}=chatStore()
    const {curruser,updateUser}=userStore()
    const blockfunc1=async()=>{
        if(!user) return;
       try{
         await updateDoc(doc(db,"users",curruser.id),{
            blocked:isReceiverBlocked?arrayRemove(user.id):arrayUnion(user.id)
         })
         const newuser=await getDoc(doc(db,"users",curruser.id))
         updateUser(newuser.data())
        blockfunc()
       }
       catch(err){
        console.log(err)
       }

    }

   useEffect(()=>{
     
       
        const unsub=onSnapshot(doc(db,"chats",chatId),(pho)=>{const phodata1=pho.data().messages
        const lipho=phodata1.flatMap((obj1)=>obj1?.imgs||[])
        
        setPhodata(lipho)
        
        })
        
    

    return ()=>{unsub()}
   },[])
   console.log(phodata)
    return(
        <div className="detailscon">
            <div className="detailsconwrap">
                <div className="dtopcover">
                    <div className="dtop">
                    <div className="dtopimgcon"><img src={!isReceiverBlocked?user?.avatar : 'https://previews.123rf.com/images/lililia/lililia1711/lililia171100462/90661589-vector-flat-icon-of-user-on-black-background.jpg'}></img></div>

                    <div className="dtoptit">{!isReceiverBlocked?user.username:"user"}</div>
                    <div className="dtopdes">Busy,Hardwork alone drives me</div>
                </div>
                </div>

                <div className="dbottom">
                    <div className="dbottomop">
                        <div className="dbottomoptit">Chat Settings</div>

                        <div className="dbottomopsym"><KeyboardArrowUpIcon></KeyboardArrowUpIcon></div>
                    </div>
                    
                    <div className="dbottomop">
                        <div className="dbottomoptit">Privacy & help</div>

                        <div className="dbottomopsym"><KeyboardArrowUpIcon></KeyboardArrowUpIcon></div>
                    </div>
                    <div className="dbottomop">
                        <div className="dbottomoptit">Shared Photos</div>

                        <div className="dbottomopsym"><KeyboardArrowDownIcon></KeyboardArrowDownIcon></div>

                    </div>

                    <div className="dbottomop onecon">
                        <div className="imgcon">
                            {phodata && phodata.length>0 && phodata.map((it,idx)=>(
                                <div className="imgit1" key={idx}>
                                <div className="imgit11"><img src={it || ''}></img></div>

                                <div className="imgit12">photo_2022_1.png</div>

                                <div className="imgit13"><FileDownloadIcon className='fdi'></FileDownloadIcon></div>
                            </div>
                            ))}
                           
                        </div></div>
                    <div className="dbottomop">
                        <div className="dbottomoptit">Shared files</div>

                        <div className="dbottomopsym"><KeyboardArrowUpIcon></KeyboardArrowUpIcon></div>
                    </div>

                    <div className='blockbtn' onClick={blockfunc1}>{isReceiverBlocked?"User blocked":isCurrUserBlocked?"You are blocked":"Block the user"}</div>
                    <div className='logoutbtn' onClick={()=>{auth.signOut()
                        }
                    }>Logout</div>
                </div>
            </div>
        </div>
    )
}