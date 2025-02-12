const readline = require("readline");
const http = require("http");
const { expect } = require("chai");

describe("Order Details API Tests (CMD Input)", function () {
  this.timeout(60000); // Increase timeout for user input

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

  const makeRequest = (options, postData) =>
    new Promise((resolve, reject) => {
      console.log("\n🔹 Sending HTTP Request:", options);
      console.log("🔹 Request Body:", postData);

      const req = http.request(options, (res) => {
        let data = "";

        console.log("🔹 Response Status:", res.statusCode);
        console.log("🔹 Response Headers:", res.headers);

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log("\n🔹 RAW RESPONSE FROM SERVER:\n", data);

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

      req.write(postData);
      req.end();
    });

  it("should filter orders based on user input", async function () {
    console.log("\n--- Filter Orders ---");

    // Taking user input
    const customerId = await askQuestion("Enter Customer ID (Press Enter to skip): ", false);
    const paymentType = await askQuestion("Enter Payment Type (Press Enter to skip): ", false);
    const orderStatus = await askQuestion("Enter Order Status (Press Enter to skip): ", false);
    const fromDate = await askQuestion("Enter Delivery From Date (YYYY-MM-DD, Press Enter to skip): ", false);
    const toDate = await askQuestion("Enter Delivery To Date (YYYY-MM-DD, Press Enter to skip): ", false);
    const orderFromDate = await askQuestion("Enter Order From Date (YYYY-MM-DD, Press Enter to skip): ", false);
    const orderToDate = await askQuestion("Enter Order To Date (YYYY-MM-DD, Press Enter to skip): ", false);

    // Creating request body
    const requestBody = {};
    if (customerId) requestBody.customerId = customerId;
    if (paymentType) requestBody.paymentType = paymentType;
    if (orderStatus) requestBody.orderStatus = orderStatus;
    if (fromDate) requestBody.fromDate = fromDate;
    if (toDate) requestBody.toDate = toDate;
    if (orderFromDate) requestBody.orderFromDate = orderFromDate;
    if (orderToDate) requestBody.orderToDate = orderToDate;

    console.log("🔹 Sending Request with:", requestBody);

    const postData = JSON.stringify(requestBody);

    // Request options (using POST method to send body)
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/orderDetails/get/:id",
      method: "POST", // Use POST to send JSON body
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    // Sending request
    const response = await makeRequest(options, postData);

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Data fetched successfully");
  });
});