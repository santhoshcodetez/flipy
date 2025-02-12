const express = require("express");
const router = express.Router();
const orderDetailController = require("../controllers/orderDetailsController");

router.get('/listall', orderDetailController.listAll);
router.post('/overview', orderDetailController.overview);
router.get('/list', orderDetailController.list);
router.post('/store', orderDetailController.store);
router.put('/update', orderDetailController.update);
router.delete('/delete', orderDetailController.delete);

module.exports = router;
