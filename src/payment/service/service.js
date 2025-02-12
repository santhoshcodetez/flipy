const { Payment } = require("../../models");

const list = async (filters, page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        throw new Error("Invalid pagination values");
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Payment.findAndCountAll({
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
        const payments = await Payment.findAll();
        const totalPayments = await Payment.count();
        return { payments, totalPayments };
    } catch (error) {
        throw new Error(error.message);
    }
};

const overview = async (id) => {
    try {
        const payment = await Payment.findOne(id);
        return payment;
    } catch (error) {
        throw new Error(error.message);
    }
};

const store = async (orderId, orderAmount, voucher, paymentType) => {
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

const update = async (id, updatedRow) => {
    try {
        const updatedPayment = await Payment.update(updatedRow, { where: { id } });
        return updatedPayment;
    } catch (error) {
        throw new Error(error.message);
    }
};

const remove = async (id) => {
    try {
        const deletedPayment = await Payment.destroy({ where: { id } });
        return deletedPayment;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { list, listAll, overview, store, update, remove };
