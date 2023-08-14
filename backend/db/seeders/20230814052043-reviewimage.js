'use strict';

const { Review, ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const review = await Review.findOne();
    await ReviewImage.bulkCreate([
    {
      reviewId: review.id,
      url: "www.reviewed.com",
    },
    {
      reviewId: review.id,
      url: "www.pingpong.com",
    },
    {
      reviewId: review.id,
      url: "www.basketball.com",
    },
    {
      reviewId: review.id,
      url: "www.drumset.com",
    },
    {
      reviewId: review.id,
      url: "www.deliciousfood.com",
    }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};