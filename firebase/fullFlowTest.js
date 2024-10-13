import { signUpOrLoginUser, logOutUser } from './auth.js';  // Import auth functions
import { saveQuizResults, updateQuizProgress } from './quizData.js';  // Import quiz functions
import { getUserProgress } from './userProgress.js';  // Import user progress retrieval function
import { auth } from './firebase.js';  // Import Firebase auth

// Full flow test with progress tracking
(async () => {
  const email = "testuser@example.com";  // Example email
  const password = "testpassword123";    // Example password

  // 1. Sign up or log in the user (depending on if the account already exists)
  const user = await signUpOrLoginUser(email, password);
  if (!user) return;  // Stop if sign-up or login failed

  const userId = user.uid;

  // 2. Save quiz results (end of quiz)
  const quizResults = {
    score: 8,
    totalQuestions: 10,
    correctAnswers: 8,
    timeTaken: 120  // Example time in seconds
  };
  await saveQuizResults(userId, quizResults);


  // 3. Retrieve and display user progress
  const userProgress = await getUserProgress(userId);


  // 4. Log out the user
  await logOutUser();
  console.log('User logged out successfully');
})();
