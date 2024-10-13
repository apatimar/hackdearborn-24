// testProgress.js

import { updateQuizProgress, saveQuizResults } from './quizData.js';
import { getUserProgressSummary } from './userProgress.js';

// Simulated user ID
const userId = "user123";  // Replace with actual user ID

// Simulate answering quiz questions
async function simulateQuiz() {
  // Question 1: Medium difficulty, correct answer
  await updateQuizProgress(userId, true, "medium", 30);

  // Question 2: Easy difficulty, wrong answer
  await updateQuizProgress(userId, false, "easy", 20);

  // Question 3: Hard difficulty, correct answer
  await updateQuizProgress(userId, true, "hard", 40);

  // Simulate saving final quiz results after the quiz ends
  const quizResults = {
    score: 2,  // Example score
    totalQuestions: 3,
    correctAnswers: 2,
    timeTaken: 90  // Total time for all questions
  };
  
  await saveQuizResults(userId, quizResults);

  // Get the user's progress summary
  const summary = await getUserProgressSummary(userId);
  console.log("Final User Progress Summary:", summary);
}

// Run the simulation
simulateQuiz();
