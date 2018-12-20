module.exports = (sequelize, DataTypes) => {
  const block = sequelize.define('Block', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER
    },
    blockId: {
      type: DataTypes.STRING
    },
    time: {
      type: DataTypes.DATE
    },
    height: {
      type: DataTypes.INTEGER
    },
    txRoot: {
      type: DataTypes.STRING
    },
    mergerId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    mergerSignature: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamp: true
  })
  block.associate = function (models) {
    // associations can be defined here
    block.hasMany(models.Transaction)
    block.hasMany(models.Signer)
  }

  return block
}
