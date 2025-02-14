const orderService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

// List orders with pagination
const list = async (req, res) => {
    try {
        let { page = 1, limit = 1, ...filters } = req.body;

        
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return responseHandler.error(res, "Invalid pagination values", 400);
        }

        const offset = (page - 1) * limit;

        console.log(`Limit: ${limit}, Offset: ${offset}`);

        const customers = await orderService.list(filters, page, limit);
        return responseHandler.success(res, "Fetched filtered customers successfully", customers);
        // console.log(responseHandler.error);
        
    } catch (error) {
        console.error("Error fetching filtered customers:", error);
        return responseHandler.error(res, "Error fetching filtered customers", 400);
    }
};


// List all orders with related details
const listAll = async (req, res) => {
    try {
        const orders = await orderService.listAll();
        return responseHandler.success(res, "All orders retrieved successfully", { data: orders });
    } catch (error) {
        return responseHandler.error(res, `Error retrieving orders: ${error.message}`, 400);
    }
};

// Get order details (overview)
const overview = async (req, res) => {
    try {
        const { id } = req.body;
        const order = await orderService.overview(id);
        return responseHandler.success(res, "Order details retrieved successfully", { data: order });
    } catch (error) {
        return responseHandler.error(res, `Error retrieving order details: ${error.message}`, 400);
    }
};

// Create a new order
const store = async (req, res) => {
    try {
        const order = await orderService.store(req.body);
        return responseHandler.success(res, "Order created successfully", { data: order });
    } catch (error) {
        return responseHandler.error(res, `Error creating order: ${error.message}`, 400);
    }
};

// Update an order
const update = async (req, res) => {
    try {
        const { id, ...updatedRow } = req.body;
        const updatedOrder = await orderService.update(id, updatedRow);
        return responseHandler.success(res, "Order updated successfully", { data: updatedOrder });
    } catch (error) {
        return responseHandler.error(res, `Error updating order: ${error.message}`, 400);
    }
};

// Delete an order
const remove = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedOrder = await orderService.remove(id);
        return responseHandler.success(res, "Order deleted successfully", { data: deletedOrder });
    } catch (error) {
        return responseHandler.error(res, `Error deleting order: ${error.message}`, 400);
    }
};

module.exports = { list, listAll, overview, store, update, remove };
