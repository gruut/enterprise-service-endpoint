module.exports = (sequelize, DataTypes) => {
  const Key = sequelize.define('Key', {
    name: DataTypes.STRING,
    certificatePem: DataTypes.TEXT,
    privateKeyPem: DataTypes.TEXT
  }, {})
  Key.associate = function () {
    // associations can be defined here
  }
  return Key
}
