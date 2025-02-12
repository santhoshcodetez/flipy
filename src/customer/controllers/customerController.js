const responseHandler = require("../../global/responseHandle");
const validateUser = require("../validations/customerValidation");
const customerService = require("../service/service");

const getCustomer = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        return responseHandler.success(res, "Fetched customers successfully", customers);
    } catch (error) {
        return responseHandler.error(res, "Error fetching customers", 400);
    }
};

const register = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return responseHandler.error(res, error.details[0].message, 400);

    try {
        const newCustomer = await customerService.registerCustomer(req.body);
        return responseHandler.success(res, "User registered successfully", newCustomer);
    } catch (error) {
        return responseHandler.error(res, error.message, 400);
    }
};

const login = async (req, res) => {
    try {
        const result = await customerService.loginCustomer(req.body);
        return responseHandler.success(res, "Login successful", result);
    } catch (error) {
        return responseHandler.error(res, error.message, 400);
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const success = await customerService.updateCustomer(id, updateData);
        if (!success) return responseHandler.error(res, "ID not found", 404);
        return responseHandler.success(res, "Updated customer successfully");
    } catch (error) {
        return responseHandler.error(res, "Error updating customer", 400);
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.body;
        const deleted = await customerService.deleteCustomer(id);
        if (!deleted) return responseHandler.error(res, "ID not found", 404);
        return responseHandler.success(res, "Deleted customer successfully");
    } catch (error) {
        return responseHandler.error(res, "Error deleting customer", 400);
    }
};

module.exports = { getCustomer, register, login, updateCustomer, deleteCustomer };
