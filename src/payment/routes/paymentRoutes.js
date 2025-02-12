const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get('/get', paymentController.getPayment);
router.post('/post', paymentController.createPayment);
router.put('/update', paymentController.updatePayment);
router.delete('/delete', paymentController.deletePayment);

module.exports = router;
