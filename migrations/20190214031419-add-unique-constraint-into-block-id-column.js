module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Blocks', ['blockId'], {
      type: 'unique',
      name: 'unique_constraint_block_id'
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Blocks', 'unique_constraint_block_id')
  }
};
