const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: 'http://localhost:3000', // Allow requests from frontend
		credentials: true, // Allow cookies & authentication headers
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
		allowedHeaders: ['Content-Type', 'Authorization'] // Allow headers
	})
);
app.use('/uploads', express.static('uploads')); // this is used to access uploads folder images for display

dotenv.config();

app.get('/', (req, res) => res.send('API is up!'));

// use the route of todo api
const api = require('./routes/api');
app.use('/api', api);

const db = require('./dbSequelize/index');
(async () => {
	try {
		await db.sequelize.authenticate();
		// await db.sequelize.sync();
		await db.sequelize.sync({ alter: true }); // for development to update table columns
		console.log('Database connected & synced successfully.');
	} catch (error) {
		console.error('Error db connection:', error);
	}
})();
// Start server
app.listen(port, err => {
	if (err) {
		console.log('server running failed: ', error);
	}
	console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('Shutting down server...');
	server.close(() => {
		console.log('Server closed.');
		process.exit(0);
	});
});
