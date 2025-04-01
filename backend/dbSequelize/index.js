const sequelize = require('./database');
const { users, todos, subtasks, attachments } = require('./models');

const db = {
	sequelize,
	Sequelize: sequelize.Sequelize,
	users,
	todos,
	subtasks,
	attachments
};

module.exports = db;
