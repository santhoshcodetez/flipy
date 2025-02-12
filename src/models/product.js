'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.OrderDetail, {
        foreignKey: "productId",
        as: "OrderDetails"
      });
    }
  }
  Product.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    ProductName: DataTypes.STRING,
    ProductCode: DataTypes.INTEGER,
    MrpPrice: DataTypes.INTEGER,
    SalePrice: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};