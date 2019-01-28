module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addIndex('Transactions', ['transactionId'])
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeIndex('Transactions', ['transactionId'])
  }
};
