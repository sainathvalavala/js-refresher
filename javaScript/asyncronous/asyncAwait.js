/**
 * ============================================================================
 * TOPIC 3: ASYNC / AWAIT — THE MODERN GOLD STANDARD
 * ============================================================================
 * 
 * WHAT IS ASYNC / AWAIT?
 * Introduced in ES2017 (ES8), `async/await` is syntactic sugar built directly on
 * top of Promises. It does not replace Promises; it makes working with them
 * incomparably cleaner and more expressive.
 * 
 * CORE RULES:
 * 1. `async` KEYWORD: Placed before a function declaration. It ensures the function
 *    ALWAYS returns a Promise (wrapping non-promises automatically).
 * 2. `await` KEYWORD: Can only be used inside an `async` function (or top-level
 *    in ES modules). It pauses execution until the Promise resolves, and yields
 *    the resolved value. If the Promise rejects, it throws an exception.
 * 
 * WHY ASYNC / AWAIT IS THE BEST OPTION (RESOLVES ALL PREVIOUS FLAWS):
 * ----------------------------------------------------------------------------
 * 1. SYNCHRONOUS COGNITIVE MODEL: Write asynchronous code that reads sequentially
 *    from top to bottom. No callbacks, no `.then()` chaining brackets.
 * 2. NATURAL VARIABLE SCOPING: Every variable (`order`, `payment`, `packageInfo`)
 *    remains in the same function scope throughout all steps. No prop drilling!
 * 3. NATIVE `try...catch...finally`: Error handling uses the language's native
 *    constructs for both synchronous exceptions AND asynchronous rejections.
 * 4. EFFORTLESS CONDITIONAL BRANCHING: Use regular `if/else`, `switch`, and
 *    `for...of` loops without awkward promise chaining acrobatics.
 * 5. PINPOINT DEBUGGING & CLEAN STACK TRACES: Step-by-step debugger breakpoints
 *    work seamlessly line by line. Stack traces point directly to exact lines.
 * ============================================================================
 */

console.log("=== 🚦 SIMPLE TASKS: ASYNC / AWAIT DEMO ===");

// 1. Defining the 4 tasks returning Promises (with resolve & reject error handling)
function task1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        console.log("Task 1 complete");
        resolve("Task 1 Data");
      } else {
        reject(new Error("Task 1 failed!"));
      }
    }, 2000);
  });
}

function task2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        console.log("Task 2 complete");
        resolve("Task 2 Data");
      } else {
        reject(new Error("Task 2 failed!"));
      }
    }, 1000);
  });
}

function task3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        console.log("Task 3 complete");
        resolve("Task 3 Data");
      } else {
        reject(new Error("Task 3 failed!"));
      }
    }, 3000);
  });
}

function task4() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        console.log("Task 4 complete");
        resolve("Task 4 Data");
      } else {
        reject(new Error("Task 4 failed!"));
      }
    }, 1500);
  });
}

// ----------------------------------------------------------------------------
// 🌟 THE ASYNC / AWAIT IMPLEMENTATION:
// Linear, top-to-bottom, native try/catch, zero nesting!
// ----------------------------------------------------------------------------
async function executeTasks() {
  try {
    const res1 = await task1();
    const res2 = await task2();
    const res3 = await task3();
    const res4 = await task4();

    console.log("🎉 All tasks completed successfully!");
  } catch (error) {
    console.error("❌ An error occurred:", error.message);
  } finally {
    console.log("🧹 Cleanup complete. Workflow finished.\n");
  }
}

// Execute the async workflow
executeTasks();

// ----------------------------------------------------------------------------
// PRO-TIP: CONCURRENT / PARALLEL ASYNC/AWAIT
// When tasks are independent, DO NOT await them sequentially!
// Run them in parallel using Promise.all:
// ----------------------------------------------------------------------------
async function loadDashboardData() {
  console.log("\n⚡ Loading user dashboard in parallel...");
  const start = Date.now();

  const fetchProfile = () => new Promise(res => setTimeout(() => res("Profile Data"), 800));
  const fetchNotifications = () => new Promise(res => setTimeout(() => res(["Notif 1", "Notif 2"]), 800));

  // ✅ Good: Both requests run at the SAME time (~800ms total, NOT 1600ms!)
  const [profile, notifs] = await Promise.all([fetchProfile(), fetchNotifications()]);

  console.log(`⚡ Dashboard loaded in ${Date.now() - start}ms:`, { profile, notifs });
}

// Trigger parallel demo after 4.5s
setTimeout(loadDashboardData, 4500);
