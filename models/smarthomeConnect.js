const Sequelize = require('sequelize');
const initModels = require('./init-models');
const config = require('../config/config');

const databaseName = config.database_connection.database;
const hostname = config.database_connection.hostname;
const password = config.database_connection.password;

// establish connection to database
const con = new Sequelize(databaseName, hostname, password, {
    host: 'dddrey.info',
    port: '3306',
    dialect: 'mysql'
});

//check connection
con.authenticate().then(() => {
    console.log('Connection to the database has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

con.sync();

const db = initModels(con);

db.devices = db.devices;
db.humidity = db.humidity;
db.temperature = db.temperature;
db.bugBounty = db.bugBounty;
db.users = db.users;

module.exports = db;
