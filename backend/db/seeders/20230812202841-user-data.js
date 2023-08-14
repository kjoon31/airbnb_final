'use strict';

const { User, Booking, Spot} = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: "daniel",
        lastName: "leinad",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: "john",
        lastName: "nhoj",
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: "parker",
        lastName: "rekrap",
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
    const user = User.findOne();
    await Spot.bulkCreate([
      {
        ownerId: user.id,
        address: "412 Grassy Lane",
        city: "Bushton",
        state: "CA",
        country: "USA",
        lat: 22,
        lng: -100,
        name: "Mangrove",
        description: "swampy",
        price: 250
      }
    ], { validate: true });
    const spot = Spot.findOne();
    await Booking.bulkCreate([
    {
      spotId: spot.id,
      userId: user.id,
      startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
      endDate: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};