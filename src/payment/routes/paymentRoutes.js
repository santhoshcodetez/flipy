const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get('/list', paymentController.list);
router.get('/listall', paymentController.listAll);
router.get('/overview/:id', paymentController.overview);
router.post('/store', paymentController.store);
router.put('/update', paymentController.update);
router.delete('/delete', paymentController.remove);

module.exports = router;
