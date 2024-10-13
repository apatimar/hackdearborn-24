// userProgress.js

import { db } from './firebase.js';
import { doc, getDoc } from "firebase/firestore";

// Get user's progress summary (after quiz ends)
export async function getUserProgressSummary(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    console.log('User progress summary:', userData);
    return userData;
  } else {
    console.log('No such user');
    return null;
  }
}
