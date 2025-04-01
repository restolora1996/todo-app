// Create Model
const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const users = sequelize.define(
	'users',
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: true
		},
		middlename: {
			type: DataTypes.STRING,
			allowNull: true
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		facebook: {
			type: DataTypes.STRING,
			allowNull: true
		},
		google: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		tableName: 'users',
		timestamps: false
	}
);

users.associate = models => {
	users.hasMany(models.todos, { foreignKey: 'user_id' });
};

const todos = sequelize.define(
	'todos',
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		dateCreated: {
			type: DataTypes.STRING,
			allowNull: true
		},
		dueDate: {
			type: DataTypes.STRING,
			allowNull: true
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		priority: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},

		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: 'users', key: 'id' }
		},
		completionDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		}
	},
	{
		tableName: 'todos',
		timestamps: true
	}
);

const subtasks = sequelize.define(
	'subtasks',
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		task_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: 'todos', key: 'id' }
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		}
	},
	{
		tableName: 'subtasks',
		timestamps: true
	}
);

const attachments = sequelize.define(
	'attachments',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		task_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'todos', key: 'id' }
		},
		fileName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		fileSize: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ tableName: 'attachments', timestamps: true }
);

todos.associate = models => {
	todos.belongsTo(models.users, { foreignKey: 'user_id' });
	todos.hasMany(models.subtasks, { foreignKey: 'task_id', as: 'subtasks' });
	todos.hasMany(models.attachments, { foreignKey: 'task_id', as: 'attachments' });
};

subtasks.associate = models => {
	subtasks.belongsTo(models.todos, { foreignKey: 'task_id', as: 'todos' });
};

attachments.associate = models => {
	attachments.belongsTo(models.todos, { foreignKey: 'task_id', as: 'todos' });
};

const models = { users, todos, subtasks, attachments };

Object.values(models).forEach(model => {
	if (model.associate) {
		model.associate(models);
	}
});

module.exports = models;

// module.exports = { users, todos, subtasks, attachments };
