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
    await updateUserProgressAfterQuiz(userId, quizResults);
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

// Update user progress after a quiz is completed
export async function updateUserProgressAfterQuiz(userId, quizResults) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  let quizzesTaken = 1;
  let totalScore = quizResults.score;
  let avgScore = quizResults.score;

  // Check if the document exists; if not, create it with initial values
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      quizzesTaken: quizzesTaken,
      totalScore: totalScore,
      avgScore: avgScore
    });
    console.log(`Created new document for user: ${userId}`);
  } else {
    // If the document exists, update the existing progress
    const userData = userSnap.data();
    quizzesTaken = userData.quizzesTaken ? userData.quizzesTaken + 1 : 1;
    totalScore = userData.totalScore ? userData.totalScore + quizResults.score : quizResults.score;
    avgScore = totalScore / quizzesTaken;

    // Update the user's progress in Firestore
    await updateDoc(userRef, {
      quizzesTaken: quizzesTaken,
      totalScore: totalScore,
      avgScore: avgScore,
    });
    console.log('User progress updated after quiz completion:', userId);
  }
}