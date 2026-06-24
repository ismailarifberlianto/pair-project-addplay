'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Playlists', [{
      name: 'Santai Dulu',
      imageUrl: 'https://as1.ftcdn.net/v2/jpg/01/07/48/44/1000_F_107484412_OlkEw8Fzo4im5GwQFiS5q1q7ancEuuP8.jpg',
      description: 'Chill a bit',
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Playlists', null, {});
  }
};
