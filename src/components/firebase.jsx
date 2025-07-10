import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'

export const creds={
    apiKey:import.meta.env.VITE_APIKEY,
    authDomain:import.meta.env.VITE_AUTHDOMAIN,
    storageBucket:import.meta.env.VITE_STORAGEBUCKET,
   messagingSenderId:import.meta.env.VITE_MESSAGINGSENDERID,
    projectId:import.meta.env.VITE_PROJECTID,
    appId:import.meta.env.VITE_APPID
}

const app=initializeApp(creds)
export const auth=getAuth(app)
export const storage=getStorage(app)
export const db=getFirestore(app)