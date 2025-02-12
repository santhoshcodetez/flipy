const paymentService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

const getPayment = async (req, res) => {
    try {
        const { productget, productCount } = await paymentService.getPayments();
        responseHandler.success(res, "Products Listed Successfully", {
            totalproducts: productCount,
            data: productget
        });
    } catch (error) {
        responseHandler.error(res, "Error listing the products", 400);
    }
};

const createPayment = async (req, res) => {
    const { orderId, orderAmount, voucher, paymentType } = req.body;
    try {
        const payment = await paymentService.createPayment(orderId, orderAmount, voucher, paymentType);
        responseHandler.success(res, "Product created successfully", { data: payment });
    } catch (error) {
        responseHandler.error(res, "Error creating the product", 400);
    }
};

const updatePayment = async (req, res) => {
    const { id, ...updatedRow } = req.body;
    try {
        const updatedProduct = await paymentService.updatePayment(id, updatedRow);
        responseHandler.success(res, "Product updated successfully", { data: updatedProduct });
    } catch (error) {
        responseHandler.error(res, "Error updating the product", 400);
    }
};

const deletePayment = async (req, res) => {
    const { id } = req.body;
    try {
        const deletedProduct = await paymentService.deletePayment(id);
        responseHandler.success(res, "Product deleted successfully", { data: deletedProduct });
    } catch (error) {
        responseHandler.error(res, "Error deleting the product", 400);
    }
};

module.exports = { deletePayment, createPayment, updatePayment, getPayment };
