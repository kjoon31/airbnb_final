'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SpotImage.init({
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
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};