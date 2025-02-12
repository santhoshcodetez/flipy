'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.hasMany(models.Order,{
        foreignKey:"customerId",
        as:"OrderValue"
      })
    }
  }
  Customer.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    Username: DataTypes.STRING,
    email: DataTypes.STRING,
    Password: DataTypes.STRING,
    contact: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};