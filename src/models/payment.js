'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "OrderValue"
      })
    }
  }
  Payment.init({
    id: {

      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    orderId: DataTypes.UUID,
    orderAmount: DataTypes.INTEGER,
    voucher: DataTypes.INTEGER,
    totalAmount: DataTypes.INTEGER,
    paymentType: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};  