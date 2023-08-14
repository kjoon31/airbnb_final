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
      models.Review.belongsTo(Spot, {
        targetKey: "id", 
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks:true
       })
      models.SpotImage.belongsTo(Spot, {
        targetKey: "id",
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks:true
       })
    }
  }
  Spot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id"
      }
    },
    address: DataTypes.STRING,
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    country: {
      type: DataTypes.STRING,
    },
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};