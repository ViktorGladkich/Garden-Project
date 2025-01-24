const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './backend/database.sqlite'
});

module.exports = sequelize;
