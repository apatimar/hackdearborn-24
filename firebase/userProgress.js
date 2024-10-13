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

// Retrieve User Progress for a specific category

export async function getUserProgressByCategory(userId, category) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const categoryData = userData.categories ? userData.categories[category] : null;
    if (categoryData) {
      return categoryData;
    } else {
      console.log(`No progress found for category "${category}"`);
      return null;
    }
  } else {
    console.log('No user data found.');
    return null;
  }
}