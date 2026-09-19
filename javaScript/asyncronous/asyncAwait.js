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

console.log("=== 🛒 E-COMMERCE FOOD ORDERING: ASYNC / AWAIT DEMO ===");

// Reusable Promise-based services
function placeOrder(item) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!item) return reject(new Error("No item selected!"));
      console.log(`Step 1: Order placed for [${item}].`);
      resolve({ id: 101, item: item, price: 250, isExpress: true });
    }, 1000);
  });
}

function processPayment(order) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (order.price <= 0) return reject(new Error("Invalid payment amount!"));
      console.log(`Step 2: Payment of ₹${order.price} processed successfully.`);
      resolve({ transactionId: "TXN_998877", status: "SUCCESS" });
    }, 1000);
  });
}

function prepareFood(item) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Step 3: Chef prepared the ${item}. Hot & ready!`);
      resolve({ packageId: "PKG_443", food: item });
    }, 1000);
  });
}

function assignDelivery(packageId, isExpress) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eta = isExpress ? "10 minutes (Express Priority)" : "35 minutes (Standard)";
      console.log(`Step 4: Package ${packageId} picked up. ETA: ${eta}`);
      resolve({ eta, agent: "Ramesh" });
    }, 1000);
  });
}

// ----------------------------------------------------------------------------
// 🌟 THE ASYNC / AWAIT IMPLEMENTATION:
// Beautiful, linear, effortlessly readable, and fully scoped!
// ----------------------------------------------------------------------------
async function executeFoodOrder(item) {
  try {
    console.log(`\n⏳ Starting order workflow for: "${item}"...`);

    // Step 1: Place Order
    const order = await placeOrder(item);

    // Step 2: Process Payment
    const payment = await processPayment(order);

    // Dynamic Conditional Logic (Trivial with async/await!)
    if (payment.status !== "SUCCESS") {
      throw new Error("Payment was rejected by bank.");
    }

    // Step 3: Prepare Food (Notice we access `order.item` directly without scope gymnastics!)
    const packageInfo = await prepareFood(order.item);

    // Step 4: Dispatch Delivery (Notice we access both `packageInfo` AND `order.isExpress`!)
    const delivery = await assignDelivery(packageInfo.packageId, order.isExpress);

    console.log(`🎉 SUCCESS! Order #${order.id} will arrive in ${delivery.eta} via ${delivery.agent}.\n`);
    return { order, delivery };

  } catch (error) {
    // 🛡️ Handles ANY error from step 1, 2, 3, or 4 seamlessly:
    console.error("❌ Order Process Failed:", error.message);
  } finally {
    // 🧹 Runs cleanup regardless of outcome:
    console.log("🧹 Lifecycle complete. Session closed safely.");
  }
}

// Execute the async workflow
executeFoodOrder("Paneer Butter Masala");

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
