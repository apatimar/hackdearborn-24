// quizData.js

import { db } from './firebase.js';
import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";

// Update progress after each question, with category tracking

export async function updateQuizProgress(userId, category, isCorrect, difficulty, timeTaken) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  // If the user document doesn't exist, create it with the categories field
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      categories: {
        [category]: {
          correctAnswers: 0,
          totalAnswers: 0,
          totalTime: 0,
          correctAnswers_easy: 0,
          correctAnswers_medium: 0,
          correctAnswers_hard: 0
        }
      }
    });
    console.log(`Created new user document for user: ${userId}`);
  }

  // Fetch the current user data and initialize categories if needed
  const userData = userSnap.data() || {};
  const categories = userData.categories || {};

  // Ensure the specific category exists within the categories object
  const categoryData = categories[category] || {
    correctAnswers: 0,
    totalAnswers: 0,
    totalTime: 0,
    correctAnswers_easy: 0,
    correctAnswers_medium: 0,
    correctAnswers_hard: 0
  };

  // Update progress for the category
  const correctAnswers = isCorrect ? categoryData.correctAnswers + 1 : categoryData.correctAnswers;
  const totalAnswers = categoryData.totalAnswers + 1;
  const totalTime = categoryData.totalTime + timeTaken;

  // Ensure the difficulty field exists and is initialized with a value
  const difficultyKey = `correctAnswers_${difficulty}`;
  const correctAnswersByDifficulty = categoryData[difficultyKey] || 0;

  // Increment if the answer is correct
  const updatedCorrectAnswersByDifficulty = isCorrect ? correctAnswersByDifficulty + 1 : correctAnswersByDifficulty;

  // Update the Firestore document with the new category data
  await updateDoc(userRef, {
    [`categories.${category}.correctAnswers`]: correctAnswers,
    [`categories.${category}.totalAnswers`]: totalAnswers,
    [`categories.${category}.totalTime`]: totalTime,
    [`categories.${category}.${difficultyKey}`]: updatedCorrectAnswersByDifficulty,  // Ensure no undefined values
  });

  console.log(`User progress updated for category "${category}" after answering question: ${userId}`);
}



// Save Quiz Results (end of quiz) and update category-specific progress

export async function saveQuizResults(userId, category, quizResults) {
  try {
    // Save the quiz results in a subcollection, tagged with category
    await setDoc(doc(db, "users", userId, "quizzes", `quiz-${Date.now()}`), {
      ...quizResults,
      category,
      timestamp: new Date(),
    });

    // After saving quiz results, update overall user progress for the category
    await updateUserProgressAfterQuiz(userId, category, quizResults);

    console.log('Quiz results and progress saved for user:', userId);
  } catch (error) {
    console.error('Error saving quiz results:', error.message);
  }
}


// Update user progress after a quiz is completed for a specific category
export async function updateUserProgressAfterQuiz(userId, category, quizResults) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  let quizzesTaken = 1;
  let totalScore = quizResults.score;
  let avgScore = quizResults.score;

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const categoryData = userData.categories[category] || {
      quizzesTaken: 0,
      totalScore: 0,
      avgScore: 0
    };

    quizzesTaken = categoryData.quizzesTaken + 1;
    totalScore = categoryData.totalScore + quizResults.score;
    avgScore = totalScore / quizzesTaken;
  }

  // Update the user's progress for the specific category in Firestore
  await updateDoc(userRef, {
    [`categories.${category}.quizzesTaken`]: quizzesTaken,
    [`categories.${category}.totalScore`]: totalScore,
    [`categories.${category}.avgScore`]: avgScore,
  });

  console.log(`User progress updated for category "${category}" after quiz completion: ${userId}`);
}