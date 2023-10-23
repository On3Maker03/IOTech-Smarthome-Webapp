const Sequelize = require('sequelize');

module.exports = function(con, DataTypes) {
  return con.define('temperature', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    temperature: {
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
    }
  }, {
    updatedAt: false,
    con,
    tableName: 'temperature',
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
