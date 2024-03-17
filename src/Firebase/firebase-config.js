import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDKV382b_aARBYKEanu31D-ZLKNgveYF9I",
    authDomain: "my-trailer-b3fda.firebaseapp.com",
    projectId: "my-trailer-b3fda",
    storageBucket: "my-trailer-b3fda.appspot.com",
    messagingSenderId: "369651249568",
    appId: "1:369651249568"
}

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
