const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Customer } = require("../../models");

const getAllCustomers = async () => {
    return await Customer.findAll();
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

const loginCustomer = async ({ Username, Password, email }) => {
    const existCustomer = await Customer.findOne({ where: { email } });
    if (!existCustomer) throw new Error("User not found. Please register first.");

    if (existCustomer.Username !== Username) throw new Error("Invalid username.");

    const isPasswordValid = await bcrypt.compare(Password, existCustomer.Password);
    if (!isPasswordValid) throw new Error("Invalid password.");
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
        { id: existCustomer.id, Username: existCustomer.Username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, user: { id: existCustomer.id, Username: existCustomer.Username, email: existCustomer.email } };
};

const updateCustomer = async (id, updateData) => {
    const updateResult = await Customer.update(updateData, { where: { id } });
    return updateResult[0] > 0;
};

const deleteCustomer = async (id) => {
    return await Customer.destroy({ where: { id } });
};

module.exports = {
    getAllCustomers,
    registerCustomer,
    loginCustomer,
    updateCustomer,
    deleteCustomer
};
