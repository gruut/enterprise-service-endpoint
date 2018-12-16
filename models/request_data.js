module.exports = (sequelize, DataTypes) => {
  const requestData = sequelize.define('RequestData', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    requester_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    data: {
      allowNull: false,
      type: DataTypes.BLOB('long')
    },
    signed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamp: true
  })
  requestData.associate = function (models) {
    // associations can be defined here
  }
  return requestData
}
