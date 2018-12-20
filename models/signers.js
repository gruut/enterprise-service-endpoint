module.exports = (sequelize, DataTypes) => {
  const Signers = sequelize.define('Signers', {
    signerId: DataTypes.STRING,
    signerSignature: {
      type: sequelize.STRING
    },
    blockId: {
      type: sequelize.INTEGER
    }
  },
  {})
  Signers.associate = (models) => {
    // associations can be defined here
    Signers.belongsTo(models.Block)
  }
  return Signers
}
