const express = require("express");
const router = express.Router();
const orderDetailController = require("../controllers/orderDetailsController");


router.get('/get', orderDetailController.getAllDetails);
router.post('/get/:id', orderDetailController.getDetailsByFilter);
router.get('/get/all', orderDetailController.getAllDetailsWithPagination);
router.post('/post', orderDetailController.createOrderDetail);
router.put('/update', orderDetailController.updateOrderDetail);
router.delete('/delete', orderDetailController.deleteOrderDetail);

module.exports = router;