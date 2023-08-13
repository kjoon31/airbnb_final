'use strict';

const { User, Spot, Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const user = await User.findOne();
    await Spot.bulkCreate([
      {
        ownerId: user.id,
        address: "1234 Pine Grove",
        city: "Mango",
        state: "CA",
        country: "USA",
        lat: 36,
        lng: -120,
        name: "Cozy Rental",
        description: "my home",
        price: 100
      }
    ], { validate: true });
    const spot = await Spot.findOne();
    await Review.bulkCreate([
      {
        spotId: spot.id,
        userId: user.id,
        review: "Great place!",
        stars: 5
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};