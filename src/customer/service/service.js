const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Customer } = require("../../models");

const getFilteredCustomers = async (filters, page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        throw new Error("Invalid pagination values");
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Customer.findAndCountAll({
        where: filters,
        limit: limit,
        offset: offset,
    });

    return {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows
    };
};


const getAllCustomers = async () => {
    return await Customer.findAll();
};

const getCustomerById = async (id) => {
    if (!id || typeof id !== "string") {
        throw new Error("Invalid or missing ID");
    }

    return await Customer.findOne({
        where: { id }, 
    });
};


const registerCustomer = async (data) => {
    const { Username, Password, email, contact } = data;

    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
        throw new Error("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    return await Customer.create({ Username, Password: hashedPassword, email, contact });
};

const updateCustomer = async (id, updateData) => {
    const updateResult = await Customer.update(updateData, { where: { id } });
    return updateResult[0] > 0;
};

const deleteCustomer = async (id) => {
    return await Customer.destroy({ where: { id } });
};

const getCustomerByEmail = async (email) => {
    return await Customer.findOne({ where: { email } });
};

module.exports = {
    getFilteredCustomers,
    getAllCustomers,
    getCustomerById,
    registerCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerByEmail
};
