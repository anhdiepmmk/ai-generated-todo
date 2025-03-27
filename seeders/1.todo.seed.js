
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Todos', [
      {
        title: 'Sample Todo 1',
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Sample Todo 2',
        completed: true,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', {
      title: ['Sample Todo 1', 'Sample Todo 2'],
    });
  },
};