const { OrderDetail, Order, Product, Customer, Payment } = require("../../models");
const { Op } = require("sequelize");

const getAllDetails = async () => {
    try {
        const details = await Order.findAll({
            include: [
                {
                    model: Customer,
                    as: "Customervalue"
                },
                {
                    model: OrderDetail,
                    as: "OrderDetails",
                    include: [
                        {
                            model: Product,
                            as: "ProductValue"
                        }
                    ]
                }
            ]
        });
        return details;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getDetailsByFilter = async (filterData) => {
    const { customerId, paymentType, orderStatus, fromDate, toDate, orderFromDate, orderToDate } = filterData;
    try {
        let whereCondition = {};

        if (customerId) whereCondition.customerId = customerId;
        if (orderStatus) whereCondition.orderStatus = orderStatus;
        
        if (fromDate || toDate) {
            whereCondition.deliveryDate = {};
            if (fromDate) {
                let deliveryFromDate = new Date(fromDate);
                deliveryFromDate.setHours(0, 0, 0, 0);
                whereCondition.deliveryDate[Op.gte] = deliveryFromDate;
            }
            if (toDate) {
                let deliveryToDate = new Date(toDate);
                deliveryToDate.setHours(23, 59, 59, 999);
                whereCondition.deliveryDate[Op.lte] = deliveryToDate;
            }
        }

        if (orderFromDate || orderToDate) {
            whereCondition.orderDate = {};
            if (orderFromDate) {
                let orderFrom = new Date(orderFromDate);
                orderFrom.setHours(0, 0, 0, 0);
                whereCondition.orderDate[Op.gte] = orderFrom;
            }
            if (orderToDate) {
                let orderTo = new Date(orderToDate);
                orderTo.setHours(23, 59, 59, 999);
                whereCondition.orderDate[Op.lte] = orderTo;
            }
        }

        let wherePaymentCondition = {};
        if (paymentType) wherePaymentCondition.paymentType = paymentType;

        const details = await Order.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Customer,
                    as: "Customervalue"
                },
                {
                    model: OrderDetail,
                    as: "OrderDetails",
                    include: [
                        {
                            model: Product,
                            as: "ProductValue"
                        }
                    ]
                },
                {
                    model: Payment,
                    as: "PaymentValue",
                    where: wherePaymentCondition,
                    where: Object.keys(wherePaymentCondition).length ? wherePaymentCondition : undefined
                    
                }
            ]
        });
        return details;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllDetailsWithPagination = async (paginationData) => {
    const { page, size, offset } = paginationData;
    try {
        const details = await Order.findAndCountAll({
            limit: size,
            offset: offset,
            include: [
                {
                    model: Customer,
                    as: "Customervalue"
                },
                {
                    model: OrderDetail,
                    as: "OrderDetails",
                    include: [
                        {
                            model: Product,
                            as: "ProductValue"
                        }
                    ]
                }
            ]
        });
        return details;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createOrderDetail = async (orderDetailData) => {
    try {
        const newOrderDetail = await OrderDetail.create(orderDetailData);
        return newOrderDetail;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateOrderDetail = async (id, updatedData) => {
    try {
        const updatedOrderDetail = await OrderDetail.update(updatedData, { where: { id } });
        return updatedOrderDetail;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteOrderDetail = async (id) => {
    try {
        const deletedOrderDetail = await OrderDetail.destroy({ where: { id } });
        return deletedOrderDetail;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAllDetails,
    getDetailsByFilter,
    getAllDetailsWithPagination,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
};
     