'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // parent
      Review.hasMany(models.ReviewImage, { foreignKey: "reviewId"})

      // child
      models.ReviewImage.belongsTo(Review, {
        targetKey: "id", 
        foreignKey: "reviewId",
        onDelete: 'CASCADE',
        hook:true
    })
    }
  }
  Review.init({
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
        model: 'User',
        key: "id"
      }
    },
    review: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 1000]
      },
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};