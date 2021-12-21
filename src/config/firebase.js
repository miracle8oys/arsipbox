// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyADyyqz-DigHZhNuPzafnjxtw2toslY_-A",
    authDomain: "course-manager-binar.firebaseapp.com",
    projectId: "course-manager-binar",
    storageBucket: "course-manager-binar.appspot.com",
    messagingSenderId: "394568276762",
    appId: "1:394568276762:web:25281b8994fc84b36a2aa3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
}

const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, signInWithGoogle, storage}