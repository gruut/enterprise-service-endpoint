module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addIndex('Blocks', ['height'])
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeIndex('Blocks', ['height'])
  }
};
