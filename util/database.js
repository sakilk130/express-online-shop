const Sequelize = require('sequelize');

const sequelize = new Sequelize('express-online-shop', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
