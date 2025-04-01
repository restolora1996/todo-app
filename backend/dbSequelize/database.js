const { Sequelize } = require('sequelize');
// Connect to database
const sequelize = new Sequelize({
	host: process.env.DB_HOST,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	dialect: 'mysql'
});

// test connection
// (async () => {
// 	try {
// 		await sequelize.authenticate();
// 		// await sequelize.sync();
// 		console.log('Database connected successfully');
// 		await db.sequelize.sync();
// 		console.log('Database synced successfully.');
// 	} catch (error) {
// 		console.log('Database connection failed');
// 	}
// })();

module.exports = sequelize;
