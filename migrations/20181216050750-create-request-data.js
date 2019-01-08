module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RequestData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requesterId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      data: {
        allowNull: false,
        type: Sequelize.BLOB('long')
      },
      processed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      transactionId: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RequestData')
  }
}
