const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get('/get', productController.getProduct);
router.post('/post', productController.createProduct);
router.put('/update', productController.updateProduct);
router.delete('/delete', productController.deleteProduct);

module.exports = router;
