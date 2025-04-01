const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

// // Create the connection
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

// Connect to the database
db.connect(err => {
	if (err) {
		console.error('Error connecting to MySQL: ', err);
		process.exit(1); // Exit if the connection fails
	}
	console.log('Connected to MySQL database');
});

// Export the db connection
module.exports = db;
