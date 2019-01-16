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
      type: DataTypes.INTEGER,
      allowNull: false
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
    Transaction.belongsTo(models.Block, {
      foreignKey: 'blockId'
    })
  }

  return Transaction
}
