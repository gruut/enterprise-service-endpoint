const { base64ToHex } = require('../plugins/my_utils')

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING
    },
    blockId: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {})
  Transaction.associate = function (models) {
    // associations can be defined here
    Transaction.belongsTo(models.Block)
  }

  Transaction.beforeCreate((tx) => {
    tx.transactionId = base64ToHex(tx.transactionId)
  })
  return Transaction
}
