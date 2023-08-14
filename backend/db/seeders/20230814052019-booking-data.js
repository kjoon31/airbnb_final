'use strict';

const { User, Spot, Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const user = await User.findOne();
    const spot = await Spot.findOne();
    await Booking.bulkCreate([
    {
      spotId: spot.id,
      userId: user.id,
      startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
      endDate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
      spotId: spot.id,
      userId: user.id,
      startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
      endDate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
      spotId: spot.id,
      userId: user.id,
      startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
      endDate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
      spotId: spot.id,
      userId: user.id,
      startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
      endDate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
      spotId: spot.id,
      userId: user.id,
      startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
      endDate: Sequelize.literal('CURRENT_TIMESTAMP')
    }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};