'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'dandan@user.io',
        username: 'dannyboy',
        firstName: "daniel",
        lastName: "leinad",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'johnjohn@user.io',
        username: 'johnnybravo',
        firstName: "john",
        lastName: "nhoj",
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'tommy@user.io',
        username: 'tommotommot',
        firstName: "tommy",
        lastName: "ymmot",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'peterparker@user.io',
        username: 'therealspiderman',
        firstName: "peter",
        lastName: "retep",
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'batman@user.io',
        username: 'thedarknight',
        firstName: "bruce",
        lastName: "wayne",
        hashedPassword: bcrypt.hashSync('password5')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['dannyboy', 'johnnybravo', 'tommotommot', 'therealspiderman', 'thedarknight'] }
    }, {});
  }
};