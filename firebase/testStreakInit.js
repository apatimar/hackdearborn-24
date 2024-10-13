import { signUpOrLoginUser, logOutUser } from './auth.js';  // Import auth functions
import { saveQuizResults } from './quizData.js';  // Import saveQuizResults function
import { getUserStreak } from './userProgress.js';  // Import streak retrieval function

// Test streak initialization and quiz saving
(async () => {
  const email = "testuser@example.com";  // Example test email
  const password = "testpassword123";    // Example test password

  // 1. Sign up or log in the user
  const user = await signUpOrLoginUser(email, password);
  if (!user) return;  // Stop if sign-up or login failed
  const userId = user.uid;

  // 2. Simulate saving quiz results for Category 1: "saving"
  console.log("\n--- Simulating Quiz Completion for Category: Saving ---");

  const quizResults = {
    score: 8,
    totalQuestions: 10,
    correctAnswers: 8,
    timeTaken: 120  // Example time in seconds
  };

  // Save quiz results and ensure streak is initialized and updated
  await saveQuizResults(userId, "saving", quizResults);

  // Retrieve the user's streak to check if it was initialized and updated
  const userStreak = await getUserStreak(userId);
  console.log(`User streak after first quiz: ${userStreak} days`);

  // Simulate waiting a day (you can modify this for quicker tests)
  console.log("\n--- Simulating Another Quiz Completion for Category: Saving ---");

  // Save another quiz result to test streak increment
  await saveQuizResults(userId, "saving", quizResults);

  // Retrieve the user's updated streak
  const updatedUserStreak = await getUserStreak(userId);
  console.log(`User streak after second quiz: ${updatedUserStreak} days`);

  // 3. Log out the user
  await logOutUser();
  console.log('User logged out successfully');
})();
