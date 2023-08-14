'use strict';

const { User, Spot } = require('../models');

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
        price: 100,
      },
      {
        ownerId: user.id,
        address: "51 Hurst Ave",
        city: "Apple",
        state: "CA",
        country: "USA",
        lat: 38,
        lng: -90,
        name: "Applehouse",
        description: "near an apple orchard",
        price: 5000
      },
      {
        ownerId: user.id,
        address: "100 Bear Dr",
        city: "Chestnut",
        state: "CA",
        country: "USA",
        lat: 16,
        lng: -100,
        name: "Big Bear",
        description: "black bears everywhere",
        price: 200
      },
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
      },
      {
        ownerId: user.id,
        address: "801 Johnston",
        city: "Curry",
        state: "CA",
        country: "USA",
        lat: 63,
        lng: 502,
        name: "Jon Snow",
        description: "really cold",
        price: 50
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};