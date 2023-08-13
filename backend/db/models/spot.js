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
    address: DataTypes.VARCHAR,
    city: DataTypes.VARCHAR,
    state: DataTypes.VARCHAR,
    country: DataTypes.VARCHAR,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.VARCHAR,
    description: DataTypes.VARCHAR,
    price: DataTypes.DECIMAL,
    createdAt: DataTypes.TIMESTAMP,
    updatedAt: DataTypes.TIMESTAMP
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};