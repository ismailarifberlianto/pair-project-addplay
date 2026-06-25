'use strict';
const bcrypt = require('bcryptjs') //

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      username: 'adminuser',
      email: 'admin@ymail.id',
      password: bcrypt.hashSync('admin123', 10),//
      role: 'admin',
      ProfileId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'userbiasa',
      email: 'userbiasa@ymail.id',
      password: bcrypt.hashSync('user4567', 10),
      role: 'user',
      ProfileId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
