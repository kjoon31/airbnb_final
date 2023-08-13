'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // parent
      Spot.hasMany(models.Booking, { foreignKey: "spotId"})
      Spot.hasMany(models.Review, { foreignKey: "spotId"})
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId"})
      // child
      models.Booking.belongsTo(Spot, { targetKey: "id", foreignKey: "spotId"})
      models.Review.belongsTo(Spot, { targetKey: "id", foreignKey: "spotId"})
      models.SpotImage.belongsTo(Spot, { targetKey: "id", foreignKey: "spotId"})
    }
  }
  Spot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};