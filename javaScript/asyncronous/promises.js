/**
 * ============================================================================
 * TOPIC 2: PROMISES — RESOLVING CALLBACK HELL & ALL PROMISE METHODS
 * ============================================================================
 * 
 * WHAT IS A PROMISE?
 * Introduced in ES6 (2015), a Promise is an object representing the eventual
 * completion (or failure) of an asynchronous operation and its resulting value.
 * 
 * A PROMISE EXISTS IN 1 OF 3 STATES:
 * 1. PENDING: Initial state, operation is still in progress.
 * 2. FULFILLED (Resolved): Operation completed successfully -> calls `.then()`.
 * 3. REJECTED: Operation failed with an error -> calls `.catch()`.
 * 
 * ============================================================================
 * COMPLETE CATALOG OF PROMISE METHODS
 * ============================================================================
 * 
 * A. INSTANCE METHODS (Called on a promise instance: `myPromise.method()`):
 * ----------------------------------------------------------------------------
 * 1. `promise.then(onFulfilled, onRejected)`
 *    - Attaches callbacks for resolution and/or rejection.
 *    - Always returns a brand-new Promise (enabling chaining).
 * 
 * 2. `promise.catch(onRejected)`
 *    - Syntactic sugar for `.then(null, onRejected)`.
 *    - Catches any error thrown or rejected upstream in the chain.
 * 
 * 3. `promise.finally(onFinally)`
 *    - Runs when the promise is settled (whether fulfilled OR rejected).
 *    - Receives no arguments. Used for cleanup (closing loaders, connections).
 * 
 * B. STATIC METHODS / COMBINATORS (Called on the constructor: `Promise.method()`):
 * ----------------------------------------------------------------------------
 * 4. `Promise.resolve(value)`
 *    - Returns an already fulfilled Promise with the provided value.
 * 
 * 5. `Promise.reject(reason)`
 *    - Returns an already rejected Promise with the provided reason/error.
 * 
 * 6. `Promise.all([p1, p2, p3])` — "ALL OR NOTHING"
 *    - Waits for ALL promises to fulfill. Returns an array of resolved values.
 *    - ❌ FAILS FAST: If ANY promise rejects, it immediately rejects with that error.
 *    - Use case: Loading critical dependencies needed together (User + Permissions).
 * 
 * 7. `Promise.allSettled([p1, p2, p3])` — "NEVER FAILS" (ES2020)
 *    - Waits for ALL promises to settle, regardless of whether they resolve or reject.
 *    - Returns an array of objects: `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.
 *    - Use case: Bulk operations (e.g. sending 100 emails, tracking analytics).
 * 
 * 8. `Promise.race([p1, p2, p3])` — "FIRST TO SETTLE WINS"
 *    - Settles as soon as the FIRST promise settles (whether it RESOLVES or REJECTS).
 *    - Use case: Request timeouts (racing an API request against a 5-second timer).
 * 
 * 9. `Promise.any([p1, p2, p3])` — "FIRST TO SUCCEED WINS" (ES2021)
 *    - Resolves as soon as the FIRST promise FULFILLS (ignores rejections).
 *    - Only rejects if ALL promises reject (with an `AggregateError`).
 *    - Use case: Fetching from redundant CDN mirrors (take first fast response).
 * 
 * 10. `Promise.withResolvers()` — (ES2024)
 *     - Returns `{ promise, resolve, reject }` without nesting an executor callback.
 * ============================================================================
 */

console.log("==================================================================");
console.log("=== 🛒 PART 1: E-COMMERCE WORKFLOW (RESOLVING CALLBACK HELL)   ===");
console.log("==================================================================");

// 1. Refactoring operations to return Promises instead of taking callbacks
function placeOrder(item) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!item) {
        return reject(new Error("No item selected!"));
      }
      console.log(`Step 1: Order placed for [${item}].`);
      resolve({ id: 101, item: item, price: 250 });
    }, 400);
  });
}

function processPayment(order) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (order.price <= 0) {
        return reject(new Error("Invalid payment amount!"));
      }
      console.log(`Step 2: Payment of ₹${order.price} processed successfully.`);
      resolve({ order, payment: { transactionId: "TXN_998877", status: "SUCCESS" } });
    }, 400);
  });
}

function prepareFood(orderData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (orderData.payment.status !== "SUCCESS") {
        return reject(new Error("Payment verification failed!"));
      }
      console.log(`Step 3: Chef prepared the ${orderData.order.item}. Hot & ready!`);
      resolve({
        ...orderData,
        packageInfo: { packageId: "PKG_443", food: orderData.order.item }
      });
    }, 400);
  });
}

function assignDelivery(finalOrderData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Step 4: Delivery partner picked up package ${finalOrderData.packageInfo.packageId}. Out for delivery!`);
      resolve({ eta: "20 minutes", agent: "Ramesh" });
    }, 400);
  });
}

// ----------------------------------------------------------------------------
// INSTANCE METHODS IN ACTION: .then(), .catch(), .finally()
// ----------------------------------------------------------------------------
placeOrder("Paneer Butter Masala")
  .then((order) => {
    return processPayment(order);
  })
  .then((orderData) => {
    return prepareFood(orderData);
  })
  .then((finalOrderData) => {
    return assignDelivery(finalOrderData);
  })
  .then((delivery) => {
    console.log(`🎉 Pipeline Success! Delivered in ${delivery.eta} by ${delivery.agent}.`);
  })
  .catch((err) => {
    // Single centralized error handler catching any failure upstream
    console.error("❌ Pipeline Failed:", err.message);
  })
  .finally(() => {
    console.log("🧹 .finally() executed: Database session closed & loader hidden.\n");
    runCombinatorsDemo();
  });


// ============================================================================
// PART 2: STATIC METHODS & COMBINATORS DEMO
// ============================================================================
function runCombinatorsDemo() {
  console.log("==================================================================");
  console.log("=== 🔬 PART 2: STATIC PROMISE METHODS & COMBINATORS            ===");
  console.log("==================================================================");

  // 1. Promise.resolve & Promise.reject
  Promise.resolve("Immediate Value from Cache").then(val => {
    console.log("\n1. Promise.resolve():", val);
  });

  Promise.reject(new Error("Pre-flight check failed!")).catch(err => {
    console.log("2. Promise.reject():", err.message);
  });

  // Mock Async Services with different delays
  const fastService   = () => new Promise(res => setTimeout(() => res("⚡ Fast Service (300ms)"), 300));
  const mediumService = () => new Promise(res => setTimeout(() => res("🚗 Medium Service (600ms)"), 600));
  const slowService   = () => new Promise(res => setTimeout(() => res("🐢 Slow Service (900ms)"), 900));
  const failingService= () => new Promise((_, rej) => setTimeout(() => rej(new Error("💥 Server Down (500ms)")), 500));

  // --------------------------------------------------------------------------
  // 3. Promise.all() — All or nothing
  // --------------------------------------------------------------------------
  Promise.all([fastService(), mediumService(), slowService()])
    .then((results) => {
      console.log("\n3. Promise.all() [ALL SUCCEEDED]:", results);
    })
    .catch((err) => console.error("Promise.all failed:", err.message));

  // Promise.all fails fast if any fails:
  Promise.all([fastService(), failingService(), slowService()])
    .then(() => console.log("Will not run"))
    .catch((err) => {
      console.log("3b. Promise.all() [ONE REJECTED]: Fails fast with ->", err.message);
    });

  // --------------------------------------------------------------------------
  // 4. Promise.allSettled() — Never fails, waits for everything
  // --------------------------------------------------------------------------
  setTimeout(() => {
    Promise.allSettled([fastService(), failingService(), slowService()])
      .then((results) => {
        console.log("\n4. Promise.allSettled() [REPORTS ALL STATUSES]:");
        results.forEach((res, i) => {
          if (res.status === "fulfilled") {
            console.log(`   Task ${i + 1}: ✅ FULFILLED -> "${res.value}"`);
          } else {
            console.log(`   Task ${i + 1}: ❌ REJECTED  -> "${res.reason.message}"`);
          }
        });
      });
  }, 1200);

  // --------------------------------------------------------------------------
  // 5. Promise.race() — First to settle wins (success OR failure)
  // Common use case: Timeout pattern
  // --------------------------------------------------------------------------
  setTimeout(() => {
    const apiRequest = () => new Promise(res => setTimeout(() => res("API Response Data"), 800));
    const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error(`Timeout of ${ms}ms exceeded!`)), ms));

    // Race against a 500ms timeout (timeout will win)
    Promise.race([apiRequest(), timeout(500)])
      .then(res => console.log("\n5. Promise.race() Won by request:", res))
      .catch(err => console.log("\n5. Promise.race() [TIMEOUT PATTERN]:", err.message));
  }, 2400);

  // --------------------------------------------------------------------------
  // 6. Promise.any() — First SUCCESSFUL promise wins (ignores failures)
  // Common use case: Redundant CDNs / mirrors
  // --------------------------------------------------------------------------
  setTimeout(() => {
    const mirror1_broken = () => new Promise((_, rej) => setTimeout(() => rej(new Error("Mirror 1 down")), 200));
    const mirror2_ok     = () => new Promise(res => setTimeout(() => res("Mirror 2 Image Loaded"), 500));
    const mirror3_ok     = () => new Promise(res => setTimeout(() => res("Mirror 3 Image Loaded"), 800));

    Promise.any([mirror1_broken(), mirror2_ok(), mirror3_ok()])
      .then((firstSuccess) => {
        console.log("\n6. Promise.any() [FIRST SUCCESS WINS]:", firstSuccess);
      })
      .catch((aggregateError) => {
        console.error("All mirrors failed:", aggregateError.errors);
      });
  }, 3200);

  // --------------------------------------------------------------------------
  // 7. Promise.withResolvers() — Modern ES2024 pattern
  // --------------------------------------------------------------------------
  setTimeout(() => {
    if (typeof Promise.withResolvers === "function") {
      const { promise, resolve, reject } = Promise.withResolvers();
      promise.then(msg => console.log("\n7. Promise.withResolvers() (ES2024):", msg));
      resolve("Resolved externally without executor wrapper!");
    } else {
      console.log("\n7. Promise.withResolvers(): Supported in Node 22+ / ES2024 browsers.");
    }
  }, 4200);
}
