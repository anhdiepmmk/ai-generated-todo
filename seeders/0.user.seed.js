const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'testuser1@example.com',
        passwordHash: passwordHash,
        firstName: 'Test',
        lastName: 'User1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'testuser2@example.com',
        passwordHash: passwordHash,
        firstName: 'Test',
        lastName: 'User2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: ['testuser1@example.com', 'testuser2@example.com'],
    });
  },
};