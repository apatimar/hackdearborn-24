import { signUpOrLoginUser, logOutUser } from './auth.js';  // Import auth functions
import { updateQuizProgress } from './quizData.js';  // Import quiz progress functions
import { getUserProgressByCategory } from './userProgress.js';  // Import progress retrieval function

// Extended test for updating quiz progress with multiple categories
(async () => {
  const email = "testuser@example.com";  // Example test email
  const password = "testpassword123";    // Example test password

  // 1. Sign up or log in the user
  const user = await signUpOrLoginUser(email, password);
  if (!user) return;  // Stop if sign-up or login failed
  const userId = user.uid;

  // 2. Simulate answering questions for Category 1: "saving"
  console.log("\n--- Simulating Category: Saving ---");

  // Easy question (correct)
  await updateQuizProgress(userId, "saving", true, 'easy', 30);
  console.log('Updated progress for an easy "saving" question (correct).');

  // Medium question (incorrect)
  await updateQuizProgress(userId, "saving", false, 'medium', 40);
  console.log('Updated progress for a medium "saving" question (incorrect).');

  // Hard question (correct)
  await updateQuizProgress(userId, "saving", true, 'hard', 50);
  console.log('Updated progress for a hard "saving" question (correct).');

  // 3. Simulate answering questions for Category 2: "investing"
  console.log("\n--- Simulating Category: Investing ---");

  // Easy question (incorrect)
  await updateQuizProgress(userId, "investing", false, 'easy', 25);
  console.log('Updated progress for an easy "investing" question (incorrect).');

  // Medium question (correct)
  await updateQuizProgress(userId, "investing", true, 'medium', 45);
  console.log('Updated progress for a medium "investing" question (correct).');

  // Hard question (correct)
  await updateQuizProgress(userId, "investing", true, 'hard', 60);
  console.log('Updated progress for a hard "investing" question (correct).');

  // 4. Retrieve and display progress for Category 1: "saving"
  console.log("\n--- Retrieving Progress for Category: Saving ---");
  const savingProgress = await getUserProgressByCategory(userId, "saving");
  if (savingProgress) {
    console.log('Progress for "saving" category:', savingProgress);
  } else {
    console.log('No progress found for "saving" category.');
  }

  // 5. Retrieve and display progress for Category 2: "investing"
  console.log("\n--- Retrieving Progress for Category: Investing ---");
  const investingProgress = await getUserProgressByCategory(userId, "investing");
  if (investingProgress) {
    console.log('Progress for "investing" category:', investingProgress);
  } else {
    console.log('No progress found for "investing" category.');
  }

  // 6. Log out the user
  await logOutUser();
  console.log('User logged out successfully');
})();
