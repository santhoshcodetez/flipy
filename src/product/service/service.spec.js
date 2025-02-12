const readline = require("readline");
const http = require("http");
const { expect } = require("chai");

describe("Product API (Only Mocha with CMD Input)", function () {
  this.timeout(60000);

  // Function to ensure mandatory user input
  const askQuestion = (query, isNumber = false) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      const ask = () => {
        rl.question(query, (answer) => {
          if (answer.trim() === "") {
            console.log("⚠️  This field is required. Please enter a value.");
            ask(); // Ask again if input is empty
          } else if (isNumber && isNaN(answer)) {
            console.log("⚠️  Please enter a valid number.");
            ask(); // Ask again if a number is expected but invalid
          } else {
            rl.close();
            resolve(isNumber ? parseFloat(answer) : answer);
          }
        });
      };
      ask(); // Start asking
    });
  };

  it("should create a new product with command-line input", async function () {
    console.log("\n--- Product Creation ---");

    const ProductName = await askQuestion("Enter Product Name: ");
    const ProductCode = await askQuestion("Enter Product Code: ", true); // Must be a number
    const MrpPrice = await askQuestion("Enter MRP Price: ", true); // Must be a number
    const SalePrice = await askQuestion("Enter Sale Price: ", true); // Must be a number
    const status = await askQuestion("Enter Product Status (Available/Out of Stock): ");

    const postData = JSON.stringify({
      ProductName,
      ProductCode,
      MrpPrice,
      SalePrice,
      status,
    });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/product/post",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const makeRequest = () =>
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

              expect(res.statusCode).to.equal(200);
              expect(response.message).to.equal("Product Created Successfully");

              console.log("\n✅ Product Created Successfully");
              resolve();
            } catch (error) {
              reject(new Error(`\nError Response: ${data}`));
            }
          });
        });

        req.on("error", (err) => {
          reject(err);
        });

        req.write(postData);
        req.end();
      });

    await makeRequest();
  });
});
