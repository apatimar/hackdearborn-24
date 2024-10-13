// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEZm1JeJeGtimtmqQCirvCUpP3YMkX_bU",
  authDomain: "hackdearborn-b34c2.firebaseapp.com",
  projectId: "hackdearborn-b34c2",
  storageBucket: "hackdearborn-b34c2.appspot.com",
  messagingSenderId: "413830432935",
  appId: "1:413830432935:web:bcd6081981f66225e0f382",
  measurementId: "G-NWNX23SL75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };