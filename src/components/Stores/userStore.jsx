import { doc, getDoc } from "firebase/firestore"
import {create} from "zustand"
import { db } from "../firebase"

export const userStore=(create((set)=>({
    curruser:null,
    isLoading:true,

    fetchUser:async(id)=>{
        if(!id){
            return set({curruser:null,isLoading:false})
        }

        try{
            const fetcheduser=await getDoc(doc(db,"users",id))
            if(fetcheduser.exists()){
                return set({curruser:fetcheduser.data(),isLoading:false})
            }
            else{
                return set({curruser:null,isLoading:false})
            }
        }
        catch(err){
            return set({curruser:null,isLoading:false})
        }
    },
    updateUser:(newuser)=>{return set({curruser:newuser})}
})))