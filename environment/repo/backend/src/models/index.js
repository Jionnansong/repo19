const sequelize = require('../config/database');
const User = require('./User');
const Member = require('./Member');

const initModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = {
  sequelize,
  User,
  Member,
  initModels
};
