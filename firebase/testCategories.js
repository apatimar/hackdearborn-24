import { signUpOrLoginUser, logOutUser } from './auth.js';  // Import auth functions
import { updateQuizProgress } from './quizData.js';  // Import quiz progress functions
import { getUserProgressByCategory } from './userProgress.js';  // Import the progress retrieval function


// Test category-based quiz progress tracking
(async () => {
  const email = "testuser@example.com";  // Example test email
  const password = "testpassword123";    // Example test password

  // 1. Sign up or log in the user
  const user = await signUpOrLoginUser(email, password);
  if (!user) return;  // Stop if sign-up or login failed
  const userId = user.uid;

  // 2. Simulate answering questions in different categories
  await updateQuizProgress(userId, "saving", true, 'easy', 30);  // Correct easy question in "saving" category
  console.log('Updated progress for "saving" category.');

  await updateQuizProgress(userId, "investing", false, 'medium', 45);  // Incorrect medium question in "investing" category
  console.log('Updated progress for "investing" category.');

  await updateQuizProgress(userId, "budgeting", true, 'hard', 60);  // Correct hard question in "budgeting" category
  console.log('Updated progress for "budgeting" category.');

  // 3. Retrieve and display category-specific progress
  const savingProgress = await getUserProgressByCategory(userId, "saving");
  console.log('Progress for "saving" category:', savingProgress);

  const investingProgress = await getUserProgressByCategory(userId, "investing");
  console.log('Progress for "investing" category:', investingProgress);

  const budgetingProgress = await getUserProgressByCategory(userId, "budgeting");
  console.log('Progress for "budgeting" category:', budgetingProgress);

  // 4. Log out the user
  await logOutUser();
  console.log('User logged out successfully');
})();
