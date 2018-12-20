module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    transaction_id: DataTypes.STRING,
    transactionId: {
      type: sequelize.STRING
    },
    blockId: {
      type: sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: sequelize.DATE
    }
  }, {})
  Transactions.associate = function (models) {
    // associations can be defined here
    Transactions.belongsTo(models.Block)
  }
  return Transactions
}
