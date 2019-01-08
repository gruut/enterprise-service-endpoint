module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Blocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      version: {
        type: Sequelize.INTEGER
      },
      blockId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      time: {
        type: Sequelize.DATE
      },
      height: {
        type: Sequelize.INTEGER
      },
      txRoot: {
        type: Sequelize.STRING
      },
      mergerId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      chainId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      prevBlockHash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      prevBlockId: {
        allowNull: false,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Blocks')
  }
}
