const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get('/get', customerController.getCustomer);
router.post('/register', customerController.register);
router.put('/update', customerController.updateCustomer);
router.delete('/delete', customerController.deleteCustomer);
router.post('/login', customerController.login);

module.exports = router;
