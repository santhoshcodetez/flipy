const readline = require("readline");
const http = require("http");
const { expect } = require("chai");

describe("Order API Tests (CMD Input)", function () {
  this.timeout(600000); // Extend timeout for user input

  // Function to get user input
  const askQuestion = (query, required = true) => {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const ask = () => {
        rl.question(query, (answer) => {
          if (required && answer.trim() === "") {
            console.log("⚠️  This field is required. Please enter a value.");
            ask();
          } else {
            rl.close();
            resolve(answer.trim());
          }
        });
      };

      ask();
    });
  };

  // Function to make HTTP requests
  const makeRequest = (options, postData) =>
    new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log("\n🔹 RAW RESPONSE FROM SERVER:\n", data);
          console.log(`\n🔹 Status Code: ${res.statusCode}`);

          try {
            const response = JSON.parse(data);
            resolve({ status: res.statusCode, body: response });
          } catch (error) {
            reject(new Error(`\nError Parsing JSON: ${error.message}\nRaw Response: ${data}`));
          }
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    });

  let orderId;

  // ✅ Create Order
  it("should create a new order", async function () {
    console.log("\n--- Order Creation ---");

    const deliveryDate = await askQuestion("Enter Delivery Date (YYYY-MM-DD): ");
    const orderDate = await askQuestion("Enter Order Date (YYYY-MM-DD): ");
    const orderStatus = await askQuestion("Enter Order Status (pending/delivered): ");
    const customerId = await askQuestion("Enter Customer ID: ");

    // 📌 Taking multiple OrderDetails dynamically
    let orderDetails = [];
    while (true) {
      console.log("\n--- Enter Order Details ---");
      const productId = await askQuestion("Enter Product ID: ");
      const Quantity = await askQuestion("Enter Quantity: ");
      const Price = await askQuestion("Enter Price: ");
      const discount = await askQuestion("Enter Discount: ");
      const status = await askQuestion("Enter Order Status (confirmed/canceled): ");

      orderDetails.push({ productId, Quantity, Price, discount, status });

      const addMore = await askQuestion("Add another order detail? (yes/no): ", false);
      if (addMore.toLowerCase() !== "yes") break;
    }

    // 📌 Taking multiple Payments dynamically
    let payments = [];
    while (true) {
      console.log("\n--- Enter Payment Details ---");
      const orderAmount = await askQuestion("Enter Order Amount: ");
      const voucher = await askQuestion("Enter Voucher Discount: ");
      const paymentType = await askQuestion("Enter Payment Type (1: Card, 2: Cash): ");

      payments.push({ orderAmount, voucher, paymentType });

      const addMorePayments = await askQuestion("Add another payment? (yes/no): ", false);
      if (addMorePayments.toLowerCase() !== "yes") break;
    }

    const postData = JSON.stringify({ deliveryDate, orderDate, orderStatus, customerId, orderDetails, payments });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/order/post",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Order Created Successfully");

    orderId = response.body.data.id; 
  });

  // ✅ Fetch All Orders
  it("should fetch all orders", async function () {
    console.log("\n--- Fetching All Orders ---");

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/order/get",
      method: "GET",
    };

    const response = await makeRequest(options);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Orders Listed Successfully");
  });

  // ✅ Update Order
  it("should update an order", async function () {
    console.log("\n--- Update Order ---");

    const id = await askQuestion("Enter Order ID to update: ");
    let orderStatus = await askQuestion("Enter New Order Status (Press Enter to skip): ", false);

    const updateData = {};
    if (orderStatus !== "") updateData.orderStatus = orderStatus;

    if (Object.keys(updateData).length === 0) {
      console.log("⚠️ No data provided for update. Exiting test.");
      return;
    }

    updateData.id = id; // ID is required

    const postData = JSON.stringify(updateData);

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/order/update",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Order Updated Successfully");
  });

  // ✅ Delete Order
  it.skip("should delete an order", async function () {
    console.log("\n--- Delete Order ---");

    const id = await askQuestion("Enter Order ID to delete: ");

    const postData = JSON.stringify({ id });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/order/delete",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Order Deleted Successfully");
  });
});
