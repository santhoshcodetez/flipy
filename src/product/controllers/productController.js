const productService = require("../service/service");
const responseHandler = require("../../global/responseHandle");

const listProducts = async (req, res) => {
    try {
        let { page = 1, limit = 1, ...filters } = req.body;

        
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return responseHandler.error(res, "Invalid pagination values", 400);
        }

        const offset = (page - 1) * limit;

        console.log(`Limit: ${limit}, Offset: ${offset}`);

        const customers = await productService.listProducts(filters, page, limit);
        return responseHandler.success(res, "Fetched filtered customers successfully", customers);
    } catch (error) {
        console.error("Error fetching filtered customers:", error);
        return responseHandler.error(res, "Error fetching filtered customers", 400);
    }
};


const listAllProducts = async (req, res) => {
    try {
        const products = await productService.listAllProducts();
        return responseHandler.success(res, "All products listed successfully", { data: products });
    } catch (error) {
        return responseHandler.error(res, `Error listing products: ${error.message}`, 400);
    }
};

const overviewProducts = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return responseHandler.error(res, "Product ID is required", 400);
        }
        const product = await productService.overviewProducts(id);
        return responseHandler.success(res, "Product details fetched successfully", { data: product });
    } catch (error) {
        return responseHandler.error(res, `Error fetching product details: ${error.message}`, 400);
    }
};

const storeProduct = async (req, res) => {
    try {
        const product = await productService.storeProduct(req.body);
        return responseHandler.success(res, "Product stored successfully", { data: product });
    } catch (error) {
        return responseHandler.error(res, `Error storing product: ${error.message}`, 400);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id, ...updatedRow } = req.body;
        const result = await productService.updateProduct(id, updatedRow);
        return responseHandler.success(res, result.message);
    } catch (error) {
        return responseHandler.error(res, `Error updating product: ${error.message}`, 400);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await productService.deleteProduct(id);
        return responseHandler.success(res, result.message);
    } catch (error) {
        return responseHandler.error(res, `Error deleting product: ${error.message}`, 400);
    }
};

module.exports = {
    listProducts,
    listAllProducts,
    overviewProducts,
    storeProduct,
    updateProduct,
    deleteProduct
};
