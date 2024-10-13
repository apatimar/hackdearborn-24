// userProgress.js

import { db } from './firebase.js';
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

// Retrieve User Progress (quiz data)

export async function getUserProgress(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    console.log('User Progress:', userData);
    return userData;
  } else {
    console.log('No user data found.');
    return null;
  }
}