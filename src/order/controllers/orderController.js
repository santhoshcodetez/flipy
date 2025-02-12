const orderService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

const getOrder = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return responseHandler.success(res, "Orders Listed Successfully", { data: orders });
    } catch (error) {
        return responseHandler.error(res, `Error listing orders: ${error.message}`, 400);
    }
};

const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        return responseHandler.success(res, "Order Created Successfully", { data: order });
    } catch (error) {
        return responseHandler.error(res, `Error creating order: ${error.message}`, 400);
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id, ...updatedRow } = req.body;
        const updatedOrder = await orderService.updateOrder(id, updatedRow);
        return responseHandler.success(res, "Order Updated Successfully", { data: updatedOrder });
    } catch (error) {
        return responseHandler.error(res, `Error updating order: ${error.message}`, 400);
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedOrder = await orderService.deleteOrder(id);
        return responseHandler.success(res, "Order Deleted Successfully", { data: deletedOrder });
    } catch (error) {
        return responseHandler.error(res, `Error deleting order: ${error.message}`, 400);
    }
};

module.exports = { deleteOrder, createOrder, updateOrder, getOrder };
