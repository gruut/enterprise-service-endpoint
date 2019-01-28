module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addIndex('Blocks', ['blockId'])
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeIndex('Blocks', ['blockId'])
  }
};
