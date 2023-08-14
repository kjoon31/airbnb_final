'use strict';

const { User, Spot, Review, SpotImage, ReviewImage } = require('../models');

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
    ], { validate: true });
    await Spot.bulkCreate([
      {
      ownerId: user.id,
      address: "512 Dev Road",
      city: "Carmen",
      state: "CA",
      country: "USA",
      lat: 17,
      lng: -163,
      name: "Bungaloo",
      description: "waterfront property",
      price: 200
    }
    ], { validate: true });
    await Review.bulkCreate([
      {
        spotId: spot.id,
        userId: user.id,
        review: "it was very WATERY!!",
        stars: 5
      }
    ], { validate: true });
    await SpotImage.bulkCreate([{
      spotId: spot.id,
      url: "www.seemyphotos.com",
      preview: true
    }], { validate: true });
    const review = await Review.findOne();
    await ReviewImage.bulkCreate([{
      reviewId: review.id,
      url: "www.reviewthisimage.com",
      }], { validate: true })
  },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};