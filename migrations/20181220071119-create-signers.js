module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Signers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      signerId: {
        type: Sequelize.STRING
      },
      signerSignature: {
        type: Sequelize.STRING(400)
      },
      blockId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Blocks',
          key: 'id'
        }
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
    return queryInterface.dropTable('Signers')
  }
}