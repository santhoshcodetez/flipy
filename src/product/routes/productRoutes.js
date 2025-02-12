const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get('/list', productController.listProducts);        
router.get('/listall', productController.listAllProducts);  // All products
router.get('/overview', productController.overviewProducts); // Overview (total count)
router.post('/store', productController.storeProduct);       // Create new product
router.put('/update', productController.updateProduct);      // Update product
router.delete('/delete', productController.deleteProduct);   // Delete product

module.exports = router;
