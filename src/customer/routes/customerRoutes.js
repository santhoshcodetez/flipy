const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post('/list', customerController.list);
router.get('/listall', customerController.listAll);
router.get('/overview/:id', customerController.overview);
router.post('/store', customerController.store);
router.put('/update', customerController.update);
router.delete('/delete', customerController.deleteCustomer);

module.exports = router;
