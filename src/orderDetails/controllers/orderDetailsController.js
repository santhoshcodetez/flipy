const orderDetailService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

const listAll = async (req, res) => {
    try {
        const details = await orderDetailService.listAll();
        return responseHandler.success(res, "Data fetched successfully", { details });
    } catch (error) {
        return responseHandler.error(res, `Error fetching data: ${error.message}`, 500);
    }
};

const overview = async (req, res) => {
    try {
        const details = await orderDetailService.overview(req.body);
        if (details.count === 0) {
            return responseHandler.error(res, "No orders found for the given criteria", 404);
        }
        return responseHandler.success(res, "Data fetched successfully", { totalCount: details.count, data: details.rows });
    } catch (error) {
        return responseHandler.error(res, `Error fetching data: ${error.message}`, 500);
    }
};

const list = async (req, res) => {
    try {
        const details = await orderDetailService.list(req.body);
        return responseHandler.success(res, "Data fetched successfully",details);
    } catch (error) {
        return responseHandler.error(res, `Error fetching data: ${error.message}`, 500);
    }
};

const store = async (req, res) => {
    try {
        const newOrderDetail = await orderDetailService.store(req.body);
        return responseHandler.success(res, "Order detail created successfully", { data: newOrderDetail });
    } catch (error) {
        return responseHandler.error(res, `Error creating order detail: ${error.message}`, 400);
    }
};

const update = async (req, res) => {
    try {
        const { id, ...updatedRow } = req.body;
        const updatedOrderDetail = await orderDetailService.update(id, updatedRow);
        return responseHandler.success(res, "Order detail updated successfully", { data: updatedOrderDetail });
    } catch (error) {
        return responseHandler.error(res, `Error updating order detail: ${error.message}`, 400);
    }
};

const deleteOrderDetail = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedOrderDetail = await orderDetailService.delete(id);
        return responseHandler.success(res, "Order detail deleted successfully", { data: deletedOrderDetail });
    } catch (error) {
        return responseHandler.error(res, `Error deleting order detail: ${error.message}`, 400);
    }
};

module.exports = {
    listAll,
    overview,
    list,
    store,
    update,
    delete: deleteOrderDetail
};
