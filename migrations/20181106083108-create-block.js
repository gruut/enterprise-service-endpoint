module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('blocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.INTEGER
      },
      blockId: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.DATE
      },
      size: {
        type: Sequelize.INTEGER
      },
      txcnt: {
        type: Sequelize.INTEGER
      },
      txlist: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('blocks')
  }
}
