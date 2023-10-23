const Sequelize = require('sequelize');

module.exports = function(con, DataTypes) {
  return con.define('humidity', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    deviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'devices',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    updatedAt: false,
    con,
    tableName: 'humidity',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "deviceId",
        using: "BTREE",
        fields: [
          { name: "deviceId" },
        ]
      },
    ]
  });
};
