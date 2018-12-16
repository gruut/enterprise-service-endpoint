module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RequestData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requester_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      data: {
        allowNull: false,
        type: Sequelize.BLOB('long')
      },
      signed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
