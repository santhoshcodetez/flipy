const { Product } = require("../../models");

const listProducts = async (filters, page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        throw new Error("Invalid pagination values");
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
        where: filters,
        limit: limit,
        offset: offset,
    });

    return {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows
    };
};
const listAllProducts = async () => {
    try {
        const products = await Product.findAll();
        return products;
    } catch (error) {
        throw new Error(error.message);
    }
};

const overviewProducts = async (id) => {
    try {
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
};

const storeProduct = async (productData) => {
    try {
        const product = await Product.create(productData);
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProduct = async (id, updatedData) => {
    try {
        await Product.update(updatedData, { where: { id } });
        return { message: "Product updated successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProduct = async (id) => {
    try {
        await Product.destroy({ where: { id } });
        return { message: "Product deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
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
