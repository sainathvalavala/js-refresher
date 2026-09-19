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

console.log("=== 🛒 E-COMMERCE FOOD ORDERING: CALLBACK HELL DEMO ===");

// 1. Simulating asynchronous steps using traditional callbacks (Error-First pattern)
function placeOrder(item, callback) {
  setTimeout(() => {
    if (!item) {
      return callback(new Error("No item selected!"), null);
    }
    console.log(`Step 1: Order placed for [${item}].`);
    const order = { id: 101, item: item, price: 250 };
    callback(null, order);
  }, 1000);
}

function processPayment(order, callback) {
  setTimeout(() => {
    if (order.price <= 0) {
      return callback(new Error("Invalid payment amount!"), null);
    }
    console.log(`Step 2: Payment of ₹${order.price} processed successfully.`);
    const payment = { transactionId: "TXN_998877", status: "SUCCESS" };
    callback(null, payment);
  }, 1000);
}

function prepareFood(order, payment, callback) {
  setTimeout(() => {
    if (payment.status !== "SUCCESS") {
      return callback(new Error("Payment verification failed!"), null);
    }
    console.log(`Step 3: Chef prepared the ${order.item}. Hot & ready!`);
    const packageInfo = { packageId: "PKG_443", food: order.item };
    callback(null, packageInfo);
  }, 1000);
}

function assignDelivery(packageInfo, callback) {
  setTimeout(() => {
    console.log(`Step 4: Delivery partner picked up package ${packageInfo.packageId}. Out for delivery!`);
    const delivery = { eta: "20 minutes", agent: "Ramesh" };
    callback(null, delivery);
  }, 1000);
}

// ----------------------------------------------------------------------------
// 💥 THE PYRAMID OF DOOM IN ACTION:
// Notice how every step requires an error check and shifts rightward:
// ----------------------------------------------------------------------------
placeOrder("Paneer Butter Masala", function (err1, order) {
  if (err1) {
    console.error("❌ Error placing order:", err1.message);
  } else {
    // Nested Level 1
    processPayment(order, function (err2, payment) {
      if (err2) {
        console.error("❌ Error processing payment:", err2.message);
      } else {
        // Nested Level 2
        prepareFood(order, payment, function (err3, packageInfo) {
          if (err3) {
            console.error("❌ Error preparing food:", err3.message);
          } else {
            // Nested Level 3
            assignDelivery(packageInfo, function (err4, delivery) {
              if (err4) {
                console.error("❌ Error assigning delivery:", err4.message);
              } else {
                // Nested Level 4
                console.log(`🎉 Final Success! Delivery in ${delivery.eta} by ${delivery.agent}.`);
              }
            });
          }
        });
      }
    });
  }
});
