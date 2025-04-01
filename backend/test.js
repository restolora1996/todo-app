const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

db.connect(err => {
	if (err) {
		console.error('Error connecting to MySQL: ', err);
		process.exit(1);
	}
	console.log('Connected to MySQL database');
});

// JWT Middleware to authenticate
function verifyToken(req, res, next) {
	const token = req.header('Authorization');
	if (!token) {
		return res.status(403).send('Access denied');
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).send('Invalid token');
		}
		req.user = decoded;
		next();
	});
}

// User Registration Route
app.post('/register', (req, res) => {
	const { username, password } = req.body;

	bcrypt.hash(password, 10, (err, hashedPassword) => {
		if (err) return res.status(500).send('Error hashing password');
		const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
		db.query(sql, [username, hashedPassword], (err, result) => {
			if (err) return res.status(500).send('Error registering user');
			res.status(201).send('User registered');
		});
	});
});

// User Login Route
app.post('/login', (req, res) => {
	const { username, password } = req.body;

	const sql = 'SELECT * FROM users WHERE username = ?';
	db.query(sql, [username], (err, result) => {
		if (err || result.length === 0) return res.status(400).send('User not found');
		const user = result[0];

		bcrypt.compare(password, user.password, (err, isMatch) => {
			if (err || !isMatch) return res.status(400).send('Invalid password');

			// Generate JWT token
			const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN
			});

			res.json({ token });
		});
	});
});

// Create Todo
app.post('/todos', verifyToken, (req, res) => {
	const { title, description } = req.body;
	const userId = req.user.id;

	const sql = 'INSERT INTO todos (title, description, user_id) VALUES (?, ?, ?)';
	db.query(sql, [title, description, userId], (err, result) => {
		if (err) return res.status(500).send('Error creating todo');
		res.status(201).send('Todo created');
	});
});

// Get All Todos
app.get('/todos', verifyToken, (req, res) => {
	const userId = req.user.id;

	const sql = 'SELECT * FROM todos WHERE user_id = ?';
	db.query(sql, [userId], (err, result) => {
		if (err) return res.status(500).send('Error fetching todos');
		res.json(result);
	});
});

// Update Todo
app.put('/todos/:id', verifyToken, (req, res) => {
	const { id } = req.params;
	const { title, description, completed } = req.body;
	const userId = req.user.id;

	const sql = 'UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?';
	db.query(sql, [title, description, completed, id, userId], (err, result) => {
		if (err) return res.status(500).send('Error updating todo');
		res.send('Todo updated');
	});
});

// Delete Todo
app.delete('/todos/:id', verifyToken, (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	const sql = 'DELETE FROM todos WHERE id = ? AND user_id = ?';
	db.query(sql, [id, userId], (err, result) => {
		if (err) return res.status(500).send('Error deleting todo');
		res.send('Todo deleted');
	});
});

// Start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
