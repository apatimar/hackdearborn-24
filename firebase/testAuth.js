// authTest.js

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebase.js';  // Ensure you import auth from your firebase.js file

// User Signup
async function signUpUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user.uid);
    return user;
  } catch (error) {
    console.error('Error signing up:', error.message);
  }
}

// User Login
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User logged in:', user.uid);
    return user;
  } catch (error) {
    console.error('Error logging in:', error.message);
  }
}

// User Logout
async function logOutUser() {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error.message);
  }
}

// Example Usage
(async () => {
  const email = "testuser@example.com";
  const password = "testpassword123";

  // Signup new user
  await signUpUser(email, password);

  // Login with the same user
  await loginUser(email, password);

  // Log out the user
  await logOutUser();
})();
