'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Songs', [{
      title: 'Duniawi',
      singer: 'Rumahsakit',
      url: 'https://music.youtube.com/watch?v=EbhFx5UPtKE&list=RDAMVMiMY4AuuxIVg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Berapa Kali Kita Akan Saling Memaafkan',
      singer: 'Pamungkas',
      url: 'https://music.youtube.com/watch?v=WhEUZrB2Osc&list=RDAMVMWhEUZrB2Osc',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'It Will Rain',
      singer: 'Bruno Mars',
      url: 'https://music.youtube.com/watch?v=W-w3WfgpcGg&si=8sUpAsKoy7A82cRH',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Songs', null, {});
  }
};
