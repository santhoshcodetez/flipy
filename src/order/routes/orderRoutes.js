const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get('/list', orderController.list); // List orders with pagination
router.get('/listall', orderController.listAll); // List all orders with details
router.get('/overview/:id', orderController.overview); // Get specific order details
router.post('/store', orderController.store); // Create a new order
router.put('/update', orderController.update); // Update an order
router.delete('/delete', orderController.remove); // Delete an order

module.exports = router;
