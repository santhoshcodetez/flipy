'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderDetail, {
        foreignKey: "orderId",
        as: "OrderDetails"
      });
    
      Order.belongsTo(models.Customer, {
        foreignKey: "customerId",
        as: "Customervalue"
      });
      
      Order.hasOne(models.Payment, {
        foreignKey: "orderId",
        as: "PaymentValue"
    });

      
    }
  }
  Order.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    orderNum: DataTypes.STRING,
    deliveryDate: DataTypes.DATE,
    orderDate: DataTypes.DATE,
    orderStatus: DataTypes.STRING,
    customerId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Order',
    // hooks: {
    //   beforeCreate: async (order) => {
    //     const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    //     const randomPart = Math.floor(1000 + Math.random() * 9000);
    //     order.orderNum = `ORD-${datePart}-${randomPart}`;
    //   }
    // }
  });

  return Order;
};