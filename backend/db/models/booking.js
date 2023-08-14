'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // parent
      // child
      Booking.belongsTo(models.User, { targetKey: "id", foreignKey: "userId"})
      Booking.belongsTo(models.Spot, { targetKey: "id", foreignKey: "spotId"})
    }
  }
  Booking.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Spot",
        key: "id"
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id"
      }
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};