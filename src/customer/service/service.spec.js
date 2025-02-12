const readline = require("readline");
const http = require("http");
const { expect } = require("chai");

describe("Customer API Tests (CMD Input)", function () {
  this.timeout(60000); // Extend timeout for user input

  // Function to get user input and force required fields
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
            ask(); // Keep asking until valid input is provided
          } else {
            rl.close();
            resolve(answer.trim());
          }
        });
      };

      ask();
    });
  };

  let token, userId;

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

  // ✅ User Registration
  it("should register a new user", async function () {
    console.log("\n--- User Registration ---");

    const Username = await askQuestion("Enter Username: ");
    const Password = await askQuestion("Enter Password: ");
    const email = await askQuestion("Enter Email: ");
    const contact = await askQuestion("Enter Contact Number: ");

    const postData = JSON.stringify({ Username, Password, email, contact });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/customer/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("User registered successfully");

    userId = response.body.data.id;

  });

  // ✅ User Login
  it("should log in", async function () {
    console.log("\n--- User Login ---");

    const Username = await askQuestion("Enter Username: ");
    const Password = await askQuestion("Enter Password: ");
    const email = await askQuestion("Enter Email: ");

    const postData = JSON.stringify({ Username, Password, email });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/customer/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Login successful");

    token = response.body.token;
  });

  // ✅ Fetch All Customers
  it("should fetch all customers", async function () {
    console.log("\n--- Fetching All Customers ---");

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/customer/get",
      method: "GET",
    };

    const response = await makeRequest(options);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Fetched customers successfully");
  });

  // ✅ Update Customer
  it("should update a customer", async function () {
    console.log("\n--- Update Customer ---");

    const id = await askQuestion("Enter User ID to update: ");
    let Username = await askQuestion("Enter New Username (Press Enter to skip): ", false);
    let contact = await askQuestion("Enter New Contact Number (Press Enter to skip): ", false);

    // Remove empty fields from request
    const updateData = {};
    if (Username !== "") updateData.Username = Username;
    if (contact !== "") updateData.contact = contact;

    if (Object.keys(updateData).length === 0) {
      console.log("⚠️ No data provided for update. Exiting test.");
      return;
    }

    updateData.id = id; // ID is required

    const postData = JSON.stringify(updateData);

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/customer/update",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Updated customer successfully");
  });

  // ✅ Delete Customer
  it("should delete a customer", async function () {
    console.log("\n--- Delete Customer ---");

    const id = await askQuestion("Enter User ID to delete: ");

    const postData = JSON.stringify({ id });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/customer/delete",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Deleted customer successfully");
  });
});
