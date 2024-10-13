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

export async function updateStreak(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  const currentDate = new Date().toISOString().split('T')[0];  // Get today's date (YYYY-MM-DD)

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const lastQuizDate = userData.lastQuizDate || null;
    let streak = userData.streak || 0;

    if (lastQuizDate) {
      const lastQuizDateObj = new Date(lastQuizDate);
      const daysDifference = Math.floor((new Date(currentDate) - lastQuizDateObj) / (1000 * 60 * 60 * 24));

      if (daysDifference === 1) {
        // User completed a quiz the previous day, so increment the streak
        streak += 1;
      } else if (daysDifference > 1) {
        // User missed a day, reset the streak
        streak = 1;
      }
    } else {
      // No previous quiz date, set streak to 1
      streak = 1;
    }

    // Update Firestore with new streak and lastQuizDate
    await updateDoc(userRef, {
      streak: streak,
      lastQuizDate: currentDate,
    });

    console.log(`User streak updated: ${streak} days in a row`);
  } else {
    // User doesn't exist, create initial streak and lastQuizDate
    await setDoc(userRef, {
      streak: 1,
      lastQuizDate: currentDate,
    });
    console.log('Created new user with streak: 1');
  }
}

export async function getUserStreak(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    return userData.streak || 0;  // Return streak or 0 if it doesn't exist
  } else {
    console.log('No user data found.');
    return 0;
  }
}