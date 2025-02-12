const responseHandler = require("../../global/responseHandle");
const validateUser = require("../validations/customerValidation");
const customerService = require("../service/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const list = async (req, res) => {
    try {
        let { page = 1, limit = 1, ...filters } = req.body;

        // Convert to numbers
        page = Number(page);
        limit = Number(limit);

        // Validation: Ensure valid numbers
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return responseHandler.error(res, "Invalid pagination values", 400);
        }

        const offset = (page - 1) * limit;

        console.log(`Limit: ${limit}, Offset: ${offset}`);

        const customers = await customerService.getFilteredCustomers(filters, page, limit);
        return responseHandler.success(res, "Fetched filtered customers successfully", customers);
    } catch (error) {
        console.error("Error fetching filtered customers:", error);
        return responseHandler.error(res, "Error fetching filtered customers", 400);
    }
};



const listAll = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        return responseHandler.success(res, "Fetched all customers successfully", customers);
    } catch (error) {
        return responseHandler.error(res, "Error fetching all customers", 400);
    }
};

const overview = async (req, res) => {
    try {
        const { id } = req.body; 
        if (!id) return responseHandler.error(res, "Customer ID is required", 400);

        console.log("Received ID:", id); 

        const customer = await customerService.getCustomerById(id);

        if (!customer) {
            return responseHandler.error(res, "Customer not found", 404);
        }

        return responseHandler.success(res, "Customer details fetched successfully", customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        return responseHandler.error(res, "Error fetching customer", 500);
    }
};


const store = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return responseHandler.error(res, error.details[0].message, 400);

    try {
        const newCustomer = await customerService.registerCustomer(req.body);
        return responseHandler.success(res, "Customer registered successfully", newCustomer);
    } catch (error) {
        return responseHandler.error(res, error.message, 400);
    }
};

const update = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const success = await customerService.updateCustomer(id, updateData);
        if (!success) return responseHandler.error(res, "Customer ID not found", 404);
        return responseHandler.success(res, "Updated customer successfully");
    } catch (error) {
        return responseHandler.error(res, "Error updating customer", 400);
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.body;
        const deleted = await customerService.deleteCustomer(id);
        if (!deleted) return responseHandler.error(res, "Customer ID not found", 404);
        return responseHandler.success(res, "Deleted customer successfully");
    } catch (error) {
        return responseHandler.error(res, "Error deleting customer", 400);
    }
};

const login = async (req, res) => {
    try {
        const { email, Password } = req.body;
        const customer = await customerService.getCustomerByEmail(email);
        if (!customer) return responseHandler.error(res, "Invalid email or password", 401);

        const isPasswordValid = await bcrypt.compare(Password, customer.Password);
        if (!isPasswordValid) return responseHandler.error(res, "Invalid email or password", 401);

        const token = jwt.sign({ id: customer.id, email: customer.email }, "yourSecretKey", { expiresIn: "1h" });

        return responseHandler.success(res, "Login successful", { token });
    } catch (error) {
        return responseHandler.error(res, "Error logging in", 400);
    }
};

module.exports = { list, listAll, overview, store, update, deleteCustomer, login };
