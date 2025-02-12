const paymentService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

const list = async (req, res) => {
    try {
        const payments = await paymentService.list();
        responseHandler.success(res, "Payments listed successfully", { data: payments });
    } catch (error) {
        responseHandler.error(res, "Error listing payments", 400);
    }
};

const listAll = async (req, res) => {
    try {
        const list = async (req, res) => {
            try {
                let { page = 1, limit = 10, ...filters } = req.body;
        
                page = Number(page);
                limit = Number(limit);
        
                if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
                    return responseHandler.error(res, "Invalid pagination values", 400);
                }
        
                const payments = await paymentService.list(filters, page, limit);
                return responseHandler.success(res, "Payments listed successfully", payments);
            } catch (error) {
                console.error("Error listing payments:", error);
                return responseHandler.error(res, "Error listing payments", 400);
            }
        };    const { payments, totalPayments } = await paymentService.listAll();
        responseHandler.success(res, "All payments listed successfully", {
            totalPayments,
            data: payments
        });
    } catch (error) {
        responseHandler.error(res, "Error listing all payments", 400);
    }
};

const overview = async (req, res) => {
    const { id } = req.body;
    try {
        const payment = await paymentService.overview(id);
        if (!payment) {
            return responseHandler.error(res, "Payment not found", 404);
        }
        responseHandler.success(res, "Payment details fetched successfully", { data: payment });
    } catch (error) {
        responseHandler.error(res, "Error fetching payment details", 400);
    }
};

const store = async (req, res) => {
    const { orderId, orderAmount, voucher, paymentType } = req.body;
    try {
        const payment = await paymentService.store(orderId, orderAmount, voucher, paymentType);
        responseHandler.success(res, "Payment stored successfully", { data: payment });
    } catch (error) {
        responseHandler.error(res, "Error storing payment", 400);
    }
};

const update = async (req, res) => {
    const { id, ...updatedRow } = req.body;
    try {
        const updatedPayment = await paymentService.update(id, updatedRow);
        responseHandler.success(res, "Payment updated successfully", { data: updatedPayment });
    } catch (error) {
        responseHandler.error(res, "Error updating payment", 400);
    }
};

const remove = async (req, res) => {
    const { id } = req.body;
    try {
        const deletedPayment = await paymentService.remove(id);
        responseHandler.success(res, "Payment deleted successfully", { data: deletedPayment });
    } catch (error) {
        responseHandler.error(res, "Error deleting payment", 400);
    }
};

module.exports = { list, listAll, overview, store, update, remove };
