const readline = require("readline");
const http = require("http");

describe("Payment API Tests (CMD Input)", function () {
  this.timeout(60000); // 60 seconds timeout for user input

  // Function to get user input
  const askQuestion = (query) => {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  };

  // Function to make HTTP requests
  const makeRequest = (options, postData = null) =>
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

  // ✅ Fetch All Payments
  it("should fetch all payments", async function () {
    console.log("\n--- Fetching All Payments ---");

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/payment/get",
      method: "GET",
    };

    const response = await makeRequest(options);
    if (response.status === 200) {
      console.log("✅ Payments fetched successfully!");
    } else {
      console.log("❌ Failed to fetch payments!");
    }
  });

  // ✅ Update Payment
  it("should update a payment", async function () {
    console.log("\n--- Update Payment ---");

    const id = await askQuestion("Enter Payment ID to update: ");
    const orderAmount = await askQuestion("Enter New Order Amount: ");
    const voucher = await askQuestion("Enter New Voucher Amount: ");

    const updateData = JSON.stringify({
      id,
      orderAmount,
      voucher,
    });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/payment/update",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(updateData),
      },
    };

    const response = await makeRequest(options, updateData);
    if (response.status === 200) {
      console.log("✅ Payment updated successfully!");
    } else {
      console.log("❌ Failed to update payment!");
    }
  });

  // ✅ Delete Payment
  it.skip("should delete a payment", async function () {
    console.log("\n--- Delete Payment ---");

    const id = await askQuestion("Enter Payment ID to delete: ");

    const deleteData = JSON.stringify({ id });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/payment/delete",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(deleteData),
      },
    };

    const response = await makeRequest(options, deleteData);
    if (response.status === 200) {
      console.log("✅ Payment deleted successfully!");
    } else {
      console.log("❌ Failed to delete payment!");
    }
  });
});
