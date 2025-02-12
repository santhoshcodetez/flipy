const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get('/get', orderController.getOrder);
router.post('/post', orderController.createOrder);
router.put('/update', orderController.updateOrder);
router.delete('/delete', orderController.deleteOrder);

module.exports = router;
