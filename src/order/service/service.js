const { OrderDetail, Order, Payment } = require("../../models");
const { generateOrderNum } = require("../validations/orderValidation");

const getAllOrders = async () => {
    try {
        const orders = await Order.findAll();
        return orders;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createOrder = async (orderData) => {
    const { deliveryDate, orderDate, orderStatus, customerId, orderDetails, payments } = orderData;
    try {
        const orderNum = generateOrderNum();
        const order = await Order.create({
            orderNum,
            deliveryDate,
            orderDate,
            orderStatus,
            customerId,
        });

        // Creating related OrderDetails
        for (const orderdetailuser of orderDetails) {
            const totalAmount = orderdetailuser.Price - orderdetailuser.discount;

            await OrderDetail.create({
                Quantity: orderdetailuser.Quantity,
                Price: orderdetailuser.Price,
                discount: orderdetailuser.discount,
                totalAmount: totalAmount,
                status: orderdetailuser.status,
                orderId: order.id,
                productId: orderdetailuser.productId
            });
        }

        // Creating related Payment entries
        for (const paymentuser of payments) {
            const totalAmounts = paymentuser.orderAmount - paymentuser.voucher;
            const paymentType = paymentuser.paymentType === 1 ? 1 : paymentuser.paymentType === 2 ? 2 : null;

            await Payment.create({
                orderId: order.id,
                orderAmount: paymentuser.orderAmount,
                voucher: paymentuser.voucher,
                totalAmount: totalAmounts,
                paymentType: paymentType  
            });
        }

        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateOrder = async (id, updatedData) => {
    try {
        const updatedOrder = await Order.update(updatedData, { where: { id } });
        return updatedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteOrder = async (id) => {
    try {
        const deletedOrder = await Order.destroy({ where: { id } });
        return deletedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder
};
