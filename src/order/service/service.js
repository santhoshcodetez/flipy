const { Order, OrderDetail, Payment } = require("../../models");
const { generateOrderNum } = require("../validations/orderValidation");

// List with pagination
const list = async (filters, page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        throw new Error("Invalid pagination values");
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Order.findAndCountAll({
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

const listAll = async () => {
    try {
        return await Order.findAll({
            include: [
                { 
                    model: OrderDetail, 
                    as: "OrderDetails" // Use the alias from Order model
                },
                { 
                    model: Payment, 
                    as: "PaymentValue" // Use the alias from Order model
                }
            ]
        });
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};


// Fetch a specific order overview
const overview = async (id) => {
    try {
        const order = await Order.findOne({
            where: { id },
            include: [
                { 
                    model: OrderDetail, 
                    as: "OrderDetails" // Use the alias from Order model
                },
                { 
                    model: Payment, 
                    as: "PaymentValue" // Use the alias from Order model
                }
            ]
        });

        if (!order) throw new Error("Order not found");
        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};


// Create an order with details and payments
const store = async (orderData) => {
    const { deliveryDate, orderDate, orderStatus, customerId, orderDetails, payments } = orderData;

    try {
        const orderNum = generateOrderNum();
        const order = await Order.create({
            orderNum,
            deliveryDate,
            orderDate,
            orderStatus,
            customerId
        });

        // Insert OrderDetails
        for (const orderDetail of orderDetails) {
            const totalAmount = orderDetail.Price - orderDetail.discount;
            await OrderDetail.create({
                Quantity: orderDetail.Quantity,
                Price: orderDetail.Price,
                discount: orderDetail.discount,
                totalAmount,
                status: orderDetail.status,
                orderId: order.id,
                productId: orderDetail.productId
            });
        }

        // Insert Payments
        for (const payment of payments) {
            const totalAmount = payment.orderAmount - payment.voucher;
            const paymentType = payment.paymentType === 1 ? 1 : payment.paymentType === 2 ? 2 : null;

            await Payment.create({
                orderId: order.id,
                orderAmount: payment.orderAmount,
                voucher: payment.voucher,
                totalAmount,
                paymentType
            });
        }

        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update an order
const update = async (id, updatedData) => {
    try {
        const updatedOrder = await Order.update(updatedData, { where: { id } });
        return updatedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete an order
const remove = async (id) => {
    try {
        const deletedOrder = await Order.destroy({ where: { id } });
        return deletedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    list,
    listAll,
    overview,
    store,
    update,
    remove
};
