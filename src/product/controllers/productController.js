const productService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

const getProduct = async (req, res) => {
    try {
        const { productget, productCount } = await productService.getAllProducts();
        return responseHandler.success(res, "Products Listed Successfully", { totalproducts: productCount, data: productget });
    } catch (error) {
        return responseHandler.error(res, `Error listing products: ${error.message}`, 400);
    }
};

const createProduct = async (req, res) => {
    try {
        const productcreate = await productService.createProduct(req.body);
        return responseHandler.success(res, "Product Created Successfully", { data: productcreate });
    } catch (error) {
        return responseHandler.error(res, `Error creating product: ${error.message}`, 400);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id, ...updatedRow } = req.body;
        const productupdate = await productService.updateProduct(id, updatedRow);
        return responseHandler.success(res, "Product Updated Successfully", { data: productupdate });
    } catch (error) {
        return responseHandler.error(res, `Error updating product: ${error.message}`, 400);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const deleteProduct = await productService.deleteProduct(id);
        return responseHandler.success(res, "Product Deleted Successfully", { data: deleteProduct });
    } catch (error) {
        return responseHandler.error(res, `Error deleting product: ${error.message}`, 400);
    }
};

module.exports = {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
