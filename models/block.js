module.exports = (sequelize, DataTypes) => {
  const block = sequelize.define('Block', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    version: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    blockId: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'unique_constraint_block_id'
    },
    time: {
      allowNull: false,
      type: DataTypes.DATE
    },
    height: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    txRoot: {
      allowNull: false,
      type: DataTypes.STRING
    },
    mergerId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    chainId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    prevBlockHash: {
      allowNull: false,
      type: DataTypes.STRING
    },
    prevBlockId: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamp: true,
    rowFormat: 'DYNAMIC'
  })
  block.associate = function (models) {
    // associations can be defined here
    block.hasMany(models.Transaction, {foreignKey: 'blockId'})
    block.hasMany(models.Signer, {
      foreignKey: 'blockId'
    })
  }

  return block
}
