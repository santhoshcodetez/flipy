const express = require("express");
const router = express.Router();


const customerRoutes = require("../customer/routes/customerRoutes");
const productRoutes = require("../product/routes/productRoutes");
const orderRoutes = require("../order/routes/orderRoutes");
const orderDetailsRoutes = require("../orderDetails/routes/orderDetailsRoutes");
const paymentRoutes = require("../payment/routes/paymentRoutes"); 


router.use('/customer', customerRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/orderDetails', orderDetailsRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;
