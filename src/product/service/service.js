const { Product } = require("../../models");

const getAllProducts = async () => {
    try {
        const productget = await Product.findAll();
        const productCount = await Product.count();
        return { productget, productCount };
    } catch (error) {
        throw new Error(error.message);
    }
};

const createProduct = async (productData) => {
    try {
        const productcreate = await Product.create(productData);
        return productcreate;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProduct = async (id, updatedData) => {
    try {
        const productupdate = await Product.update(updatedData, { where: { id } });
        return productupdate;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProduct = async (id) => {
    try {
        const deleteProduct = await Product.destroy({ where: { id } });
        return deleteProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
