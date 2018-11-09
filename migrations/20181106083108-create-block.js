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
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DATE
      },
      size: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      },
      txRoot: {
        type: Sequelize.STRING
      },
      signerId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      signerSignature: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mergerId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mergerSignature: {
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
