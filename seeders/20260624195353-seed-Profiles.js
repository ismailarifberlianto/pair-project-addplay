'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Profiles', [{
      username: 'adminuser',
      email: 'admin@ymail.id',
      age: 23,
      gender: 'Female',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'userbiasa',
      email: 'userbiasa@ymail.id',
      age: 26,
      gender: 'Male',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
