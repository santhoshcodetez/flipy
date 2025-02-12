const orderDetailService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

const getAllDetails = async (req, res) => {
    try {
        const details = await orderDetailService.getAllDetails();
        return responseHandler.success(res, "Data fetched successfully", { data: details });
    } catch (error) {
        return responseHandler.error(res, `Error fetching data: ${error.message}`, 500);
    }
};

const getDetailsByFilter = async (req, res) => {
    try {
        const details = await orderDetailService.getDetailsByFilter(req.body);
        if (details.count === 0) {
            return responseHandler.error(res, "No orders found for the given criteria", 404);
        }
        return responseHandler.success(res, "Data fetched successfully", { totalCount: details.count, data: details.rows });
    } catch (error) {
        return responseHandler.error(res, `Error fetching data: ${error.message}`, 500);
    }
};

const getAllDetailsWithPagination = async (req, res) => {
    try {
        const details = await orderDetailService.getAllDetailsWithPagination(req.query);
        return responseHandler.success(res, "Data fetched successfully", { totalCount: details.count, data: details.rows });
    } catch (error) {
        return responseHandler.error(res, `Error fetching data: ${error.message}`, 500);
    }
};

const createOrderDetail = async (req, res) => {
    try {
        const newOrderDetail = await orderDetailService.createOrderDetail(req.body);
        return responseHandler.success(res, "Order detail created successfully", { data: newOrderDetail });
    } catch (error) {
        return responseHandler.error(res, `Error creating order detail: ${error.message}`, 400);
    }
};

const updateOrderDetail = async (req, res) => {
    try {
        const { id, ...updatedRow } = req.body;
        const updatedOrderDetail = await orderDetailService.updateOrderDetail(id, updatedRow);
        return responseHandler.success(res, "Order detail updated successfully", { data: updatedOrderDetail });
    } catch (error) {
        return responseHandler.error(res, `Error updating order detail: ${error.message}`, 400);
    }
};

const deleteOrderDetail = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedOrderDetail = await orderDetailService.deleteOrderDetail(id);
        return responseHandler.success(res, "Order detail deleted successfully", { data: deletedOrderDetail });
    } catch (error) {
        return responseHandler.error(res, `Error deleting order detail: ${error.message}`, 400);
    }
};

module.exports = {
    deleteOrderDetail,
    createOrderDetail,
    updateOrderDetail,
    getAllDetails,
    getDetailsByFilter,
    getAllDetailsWithPagination
};
