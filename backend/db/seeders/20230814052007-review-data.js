'use strict';

const { Spot, User, Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
      const user = await User.findOne();
      const spot = await Spot.findOne();
      await Review.bulkCreate([
        {
          spotId: spot.id,
          userId: user.id,
          review: "lots of mango trees!",
          stars: 5
        },
        {
          spotId: spot.id,
          userId: user.id,
          review: "red apples are crisp and tart!",
          stars: 4
        },
        {
          spotId: spot.id,
          userId: user.id,
          review: "squirrels are everywhere",
          stars: 5
        },
        {
          spotId: spot.id,
          userId: user.id,
          review: "there is a lot of lavish greenery",
          stars: 3
        },
        {
          spotId: spot.id,
          userId: user.id,
          review: "Best place to get some good curry!!",
          stars: 5
        }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};