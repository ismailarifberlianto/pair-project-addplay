'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('PlaylistSongs', {
      fields: ['PlaylistId', 'SongId'],
      type: 'unique',
      name: 'unique_constraint_PlaylistSongs'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('PlaylistSongs', 'unique_constraint_PlaylistSongs');
  }
};
