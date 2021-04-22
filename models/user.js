const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    alllowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    alllowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    alllowNull: false,
  },
});

module.exports = User;
