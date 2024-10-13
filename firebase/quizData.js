// quizData.js

import { db } from './firebase.js';
import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";

// Save Quiz Results (end of quiz)
export async function saveQuizResults(userId, quizResults) {
  try {
    await setDoc(doc(db, "users", userId, "quizzes", `quiz-${Date.now()}`), {
      ...quizResults,
      timestamp: new Date(),
    });
    console.log('Quiz results saved for user:', userId);
  } catch (error) {
    console.error('Error saving quiz results:', error.message);
  }
}

// Update progress after each question
export async function updateQuizProgress(userId, isCorrect, difficulty, timeTaken) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  // If the user doesn't exist, create a new document with initial data
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      correctAnswers: 0,
      totalAnswers: 0,
      totalTime: 0,
      quizzesTaken: 0,
      avgScore: 0,
      correctAnswers_easy: 0,
      correctAnswers_medium: 0,
      correctAnswers_hard: 0
    });
    console.log(`Created new user document for user: ${userId}`);
  }

  // Update progress after creating the user document
  const correctAnswers = isCorrect ? increment(1) : increment(0);
  const totalAnswers = increment(1);
  const totalTime = increment(timeTaken);

  // Track correct answers by difficulty
  const difficultyRef = `correctAnswers_${difficulty}`;
  const currentDifficultyCorrect = isCorrect ? increment(1) : increment(0);

  await updateDoc(userRef, {
    correctAnswers: correctAnswers,
    totalAnswers: totalAnswers,
    totalTime: totalTime,
    [difficultyRef]: currentDifficultyCorrect
  });

  console.log('User progress updated after answering question:', userId);
}
