import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Function to sign up or log in a user depending on if they already exist
export async function signUpOrLoginUser(email, password) {
  try {
    // Attempt to sign up the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    // If the email is already in use, try logging in instead
    if (error.code === 'auth/email-already-in-use') {
      console.log('Email already in use, logging in instead...');
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', userCredential.user.uid);
        return userCredential.user;
      } catch (loginError) {
        console.error('Error logging in:', loginError.message);
      }
    } else {
      console.error('Error signing up:', error.message);
    }
  }
}


// User Logout
export async function logOutUser() {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
}