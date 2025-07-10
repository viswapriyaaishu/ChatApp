import {create} from "zustand"
import { userStore } from "./userStore"

export const chatStore=create((set)=>({
    user:null,
    chatId:null,
    isCurrUserBlocked:false,
    isReceiverBlocked:false,

    chatfunc:(user,chatId)=>{
        const curruser=userStore.getState().curruser
        if(user.blocked.includes(curruser.id)){
            return set({user:null,chatId,isCurrUserBlocked:true,isReceiverBlocked:false})
        }
        else if(curruser.blocked.includes(user.id)){
            return set({user,chatId,isCurrUserBlocked:false,isReceiverBlocked:true})
        }
        else{
            return set({user,chatId,isCurrUserBlocked:false,isReceiverBlocked:false})
        }
    },

    

    blockfunc:()=>{
        return set((state)=>({...state,isReceiverBlocked:!state.isReceiverBlocked}))
    },

    resetchat:()=>{
        return set({user:null,chatId:null,isCurrUserBlocked:false,isReceiverBlocked:false})
    }
}))