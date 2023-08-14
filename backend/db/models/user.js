'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // parent
      User.hasMany(models.Review, { foreignKey: "userId"})
      User.hasMany(models.Booking, { foreignKey: "userId"})
      User.hasMany(models.Spot, { foreignKey: "ownerId"})
      // child
      models.Review.belongsTo(User, { targetKey: "id", foreignKey: "userId"})
      models.Booking.belongsTo(User,  { targetKey: "id", foreignKey: "userId"})
      models.Spot.belongsTo(User, { targetKey: "id", foreignKey: "ownerId"})
    }
  };

  User.init(
    {
      firstName:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true,
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};