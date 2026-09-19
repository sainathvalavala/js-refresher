/**
 * ============================================================================
 * TOPIC 1: CALLBACK HELL & THE PYRAMID OF DOOM
 * ============================================================================
 * 
 * WHAT IS A CALLBACK?
 * A callback is a function passed into another function as an argument to be
 * executed after an asynchronous task completes.
 * 
 * WHAT IS CALLBACK HELL?
 * When multiple asynchronous operations depend on the result of the previous one,
 * callbacks must be nested inside callbacks, inside callbacks...
 * This forms a deeply nested, horizontal triangle pattern often called:
 * 1. "The Pyramid of Doom"
 * 2. "The Christmas Tree Problem"
 * 
 * MAJOR DRAWBACKS OF CALLBACKS:
 * ----------------------------------------------------------------------------
 * 1. UNREADABLE & UNMAINTAINABLE: Code moves horizontally to the right instead
 *    of vertically down. Hard to track execution flow.
 * 2. NIGHTMARISH ERROR HANDLING: You must handle errors manually with 
 *    `if (err)` at EVERY SINGLE nesting level. If you forget one, bugs silently fail.
 * 3. INVERSION OF CONTROL: You trust a third-party function to call your callback
 *    at the right time, with the right parameters, and only ONCE (what if it calls
 *    it zero times, or five times?).
 * 4. VARIABLE SCOPING ISSUES: Outer variables bleed into inner closures, leading
 *    to accidental memory leaks and state contamination.
 * ============================================================================
 */

console.log("=== 🚦 SIMPLE TASKS: CALLBACK HELL DEMO (WITH ERROR HANDLING) ===");

// 1. Defining 4 sequential tasks using the standard Error-First callback pattern: (err, data)
function task1(callback) {
  setTimeout(() => {
    const success = true;
    if (success) {
      console.log("Task 1 complete");
      callback(null, "Task 1 Data");
    } else {
      callback(new Error("Task 1 failed!"), null);
    }
  }, 2000);
}

function task2(callback) {
  setTimeout(() => {
    const success = true;
    if (success) {
      console.log("Task 2 complete");
      callback(null, "Task 2 Data");
    } else {
      callback(new Error("Task 2 failed!"), null);
    }
  }, 1000);
}

function task3(callback) {
  setTimeout(() => {
    const success = true;
    if (success) {
      console.log("Task 3 complete");
      callback(null, "Task 3 Data");
    } else {
      callback(new Error("Task 3 failed!"), null);
    }
  }, 3000);
}

function task4(callback) {
  setTimeout(() => {
    const success = true;
    if (success) {
      console.log("Task 4 complete");
      callback(null, "Task 4 Data");
    } else {
      callback(new Error("Task 4 failed!"), null);
    }
  }, 1500);
}

// ----------------------------------------------------------------------------
// 💥 THE PYRAMID OF DOOM (CALLBACK HELL) WITH ERROR HANDLING:
// Notice the nightmare: you must write `if (err)` at EVERY single nesting level!
// ----------------------------------------------------------------------------
task1((err1, data1) => {
  if (err1) {
    console.error("❌ Error in Task 1:", err1.message);
  } else {
    // Nested Level 1
    task2((err2, data2) => {
      if (err2) {
        console.error("❌ Error in Task 2:", err2.message);
      } else {
        // Nested Level 2
        task3((err3, data3) => {
          if (err3) {
            console.error("❌ Error in Task 3:", err3.message);
          } else {
            // Nested Level 3
            task4((err4, data4) => {
              if (err4) {
                console.error("❌ Error in Task 4:", err4.message);
              } else {
                // Nested Level 4
                console.log("🎉 All tasks completed successfully!");
              }
            });
          }
        });
      }
    });
  }
});
