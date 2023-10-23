const Sequelize = require('sequelize');

var DataTypes = require("sequelize").DataTypes;
var _devices = require("./devices");
var _humidity = require("./humidity");
var _temperature = require("./temperature");
var _users = require("./users");
var _bugBounty = require("./bugBounty");

// Initiate models and return
function initModels(con) {
  var devices = _devices(con, DataTypes);
  var humidity = _humidity(con, DataTypes);
  var temperature = _temperature(con, DataTypes);
  var users = _users(con, DataTypes);
  var bugBounties = _bugBounty(con, DataTypes);

  humidity.belongsTo(devices, { as: "device", foreignKey: "deviceId"});
  devices.hasMany(humidity, { as: "humidities", foreignKey: "deviceId"});
  temperature.belongsTo(devices, { as: "device", foreignKey: "deviceId"});
  devices.hasMany(temperature, { as: "temperatures", foreignKey: "deviceId"});

  return {
    devices,
    humidity,
    temperature,
    users,
    bugBounties,
  };

}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
