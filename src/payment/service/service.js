const { Payment } = require("../../models");

const getPayments = async () => {
    try {
        const productget = await Payment.findAll();
        const productCount = await Payment.count();
        return { productget, productCount };
    } catch (error) {
        throw new Error(error.message);
    }
};

const createPayment = async (orderId, orderAmount, voucher, paymentType) => {
    try {
        const totalAmount = orderAmount - voucher;
        const paymentDescription =
            paymentType === 1
                ? "Online Payment"
                : paymentType === 2
                ? "Cash Payment"
                : "Unknown Payment Type";

        const payment = await Payment.create({
            orderId,
            orderAmount,
            voucher,
            totalAmount,
            paymentType,
            paymentDescription
        });
        return payment;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updatePayment = async (id, updatedRow) => {
    try {
        const productupdate = await Payment.update(updatedRow, { where: { id } });
        return productupdate;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deletePayment = async (id) => {
    try {
        const deleteProduct = await Payment.destroy({ where: { id } });
        return deleteProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { getPayments, createPayment, updatePayment, deletePayment };
