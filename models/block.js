module.exports = (sequelize, DataTypes) => {
  const block = sequelize.define('Block', {
    sender: DataTypes.STRING,
    version: DataTypes.INTEGER,
    blockId: DataTypes.INTEGER,
    time: DataTypes.DATE,
    size: DataTypes.INTEGER,
    txcnt: DataTypes.INTEGER,
    txlist: DataTypes.JSON
  }, {})
  block.associate = function (models) {
    // associations can be defined here
  }
  return block
}
