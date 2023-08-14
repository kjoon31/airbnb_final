'use strict';

const { SpotImage, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const spot = await Spot.findOne();
    await Spot.bulkCreate([
    {
      spotId: spot.id,
      url: "www.windtunnel.com",
      preview: true
    },
    {
      spotId: spot.id,
      url: "www.spaceflight.com",
      preview: true
    },
    {
      spotId: spot.id,
      url: "www.rubberband.com",
      preview: true
    },
    {
      spotId: spot.id,
      url: "www.bigskyscraper.com",
      preview: true
    },
    {
      spotId: spot.id,
      url: "www.undergroundcity.com",
      preview: true
    }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};