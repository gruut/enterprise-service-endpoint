module.exports = (sequelize, DataTypes) => {
  const Signer = sequelize.define('Signer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    signerId: DataTypes.STRING,
    signerSignature: {
      type: DataTypes.STRING(400)
    },
    blockId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {})
  Signer.associate = (models) => {
    // associations can be defined here
    Signer.belongsTo(models.Block, {
      foreignKey: 'blockId'
    })
  }

  return Signer
}
