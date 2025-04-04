const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getData = require('../functions/getData');
const create = require('../functions/create');
const update = require('../functions/update');
const { verifyToken, decodeToken, setToken, clearToken } = require('../functions/auth');
const multer = require('multer');
const path = require('path');
const db = require('../dbSequelize');
const { fileSizeToMB } = require('../functions/helper');
const fs = require('fs');
// Multer storage configuration
const storage = multer.diskStorage({
	destination: './uploads/', // Save files in `uploads/` folder
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|pdf/;
		const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
		const mimeType = allowedTypes.test(file.mimetype);

		if (mimeType && extName) {
			return cb(null, true);
		}
		cb(new Error('Only images and PDFs are allowed!'));
	}
});

router.get('/:entity', verifyToken, async (req, res) => {
	try {
		const { entity } = req.params;
		if (!entity) throw new Error('entity is required.');

		let where = null;
		if (entity === 'todos') {
			const user = await decodeToken(req);
			where = { user_id: user?.id, deleted: false };
		}

		const data = await getData({ entity, where });
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: { message: error?.message } });
	}
});

router.get('/:entity/:id', verifyToken, async (req, res) => {
	try {
		const { id, entity } = req.params;
		if (!entity) throw new Error('entity is required.');

		let where = {};
		if (entity === 'todos') {
			const user = await decodeToken(req);
			where = { user_id: user?.id, deleted: 0 };
		}

		const data = await getData({ entity, id, where });

		res.status(200).send(data);
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: { message: error?.message } });
	}
});

router.post('/create/:entity', verifyToken, upload.any(), async (req, res) => {
	try {
		const { entity } = req.params;
		if (!entity) throw new Error('entity is required.');

		const fields = req.body;

		if (entity === 'todos') {
			let attachments = [];
			if (req.files.length) {
				attachments = req.files.map(file => ({
					fileName: `/uploads/${file.filename}`,
					fileSize: fileSizeToMB(file.size)
				}));
			}
			const parsedSubtasks = fields?.subtasks?.length ? JSON.parse(fields?.subtasks) : [];
			const include = { include: ['subtasks', 'attachments'] };
			const response = await create({ entity, data: { ...fields, subtasks: parsedSubtasks, attachments }, include });

			res.send({
				data: response.dataValues,
				message: 'successfully created.'
			});
		} else {
			const response = await create({ entity, data: fields });
			res.send({ data: response.dataValues, message: 'successfully created.' });
		}
	} catch (error) {
		// Remove uploaded files if error occurs
		if (req.files.length) {
			req.files.forEach(file => {
				fs.unlink(path.join(__dirname, '../uploads', file.filename), err => {
					if (err) console.error('Error deleting file:', err);
				});
			});
		}
		res.status(500).send({ error: { message: error?.message } });
	}
});

router.put('/update/:entity/:id', verifyToken, upload.any(), async (req, res) => {
	try {
		const { id, entity } = req.params;
		const { subtasks = [], attachments = [], ...updatedData } = req.body;
		if (!entity) throw new Error('entity is required.');

		if (entity === 'todos') {
			let attachementPayload = Array.isArray(attachments)
				? attachments.map(d => (d ? JSON.parse(d) : {}))
				: JSON.parse(attachments);
			if (req.files.length) {
				attachementPayload = [
					...attachementPayload,
					...req.files.map(file => ({
						fileName: `/uploads/${file.filename}`,
						fileSize: fileSizeToMB(file.size)
					}))
				];
			}
			const existingTask = await getData({ entity, where: { id }, all: false });

			if (!existingTask) return res.status(404).json({ message: 'Task not found' });

			// Extract existing attachments
			const prevAttachments = existingTask?.attachments.map(item => ({
				id: item.id,
				fileName: item.fileName,
				fileSize: item.fileSize
			}));
			// Convert to maps for easier comparison
			const prevAttachmentsMap = new Map(prevAttachments.map(sub => [sub.id, sub]));
			// New subtasks (no ID)
			const newAttachments = attachementPayload.filter(sub => !sub?.id);
			// Existing subtasks to update
			const updatedAttachments = attachementPayload.filter(sub => sub?.id && prevAttachmentsMap.has(sub?.id));
			// Subtasks to delete
			const deleteAttachemnts = prevAttachments.filter(
				sub => !attachementPayload.some(newSub => newSub?.id === sub?.id)
			);
			// 1. Insert new attachments
			if (newAttachments.length > 0) {
				await create({ entity: 'attachments', data: newAttachments.map(item => ({ ...item, task_id: id })) });
			}
			// 2. Update existing attachments
			for (const attachment of updatedAttachments) {
				await update({
					entity: 'attachments',
					data: { title: attachment.title, status: attachment.status },
					where: { id: attachment.id }
				});
			}
			// 3. Delete removed attachments
			if (deleteAttachemnts.length > 0) {
				await db['attachments'].destroy({ where: { id: deleteAttachemnts.map(item => item.id) } });
				// Remove uploaded file
				deleteAttachemnts.forEach(file => {
					fs.unlink(path.join(__dirname, '../uploads', file?.fileName.replace('/uploads/', '')), err => {
						if (err) console.error('Error deleting file:', err);
						console.log(`file ${file.fileName} is successfully deleted.`);
					});
				});
			}

			// Extract existing subtasks
			const existingSubtasks = existingTask.subtasks.map(subtask => ({
				id: subtask.id,
				title: subtask.title,
				status: subtask.status
			}));

			const parsedSubtasks = subtasks?.length ? JSON.parse(subtasks) : [];

			// Convert to maps for easier comparison
			const existingSubtasksMap = new Map(existingSubtasks.map(sub => [sub.id, sub]));
			// New subtasks (no ID)
			const newSubtasks = parsedSubtasks.filter(sub => !sub.id);
			// Existing subtasks to update
			const updatedSubtasks = parsedSubtasks.filter(sub => sub.id && existingSubtasksMap.has(sub.id));
			// Subtasks to delete
			const deletedSubtasks = existingSubtasks.filter(sub => !parsedSubtasks.some(newSub => newSub.id === sub.id));
			// 1. Insert new subtasks
			if (newSubtasks.length > 0) {
				await create({ entity: 'subtasks', data: newSubtasks.map(sub => ({ ...sub, task_id: id })) });
			}
			// 2. Update existing subtasks
			for (const sub of updatedSubtasks) {
				await update({
					entity: 'subtasks',
					data: { title: sub.title, status: sub.status },
					where: { id: sub.id }
				});
			}
			// 3. Delete removed subtasks
			if (deletedSubtasks.length > 0) {
				await db['subtasks'].destroy({ where: { id: deletedSubtasks.map(sub => sub.id) } });
			}

			// update todos fields
			await update({ entity: 'todos', data: updatedData, where: { id } });
			// acquire todos by id as response
			const response = await getData({ entity, where: { id } });
			res.send({ data: response, message: 'successfully updated.' });
		} else {
			const response = await update({ entity, data, where: { id } });
			res.send({ data: response, message: 'successfully updated.' });
		}
	} catch (error) {
		// Remove uploaded files if error occurs
		if (req.files.length) {
			req.files.forEach(file => {
				fs.unlink(path.join(__dirname, '../uploads', file.filename), err => {
					if (err) console.error('Error deleting file:', err);
				});
			});
		}
		res.status(500).send({ error: { message: error?.message } });
	}
});

router.put('/delete/:entity', verifyToken, async (req, res) => {
	try {
		const { entity } = req.params;
		if (!entity) throw new Error('entity is required.');

		const { id } = req.body;
		if (!id) throw new Error('id is required.');

		await update({ entity, data: { deleted: true }, where: { id } });
		res.send({ message: 'successfully deleted.', deletedIds: id });
	} catch (error) {
		console.log('delete:', error);
		res.status(500).send({ error: { message: error?.message } });
	}
});

router.put('/recover/:id', async (req, res) => {
	try {
		const { id, entity } = req.params;
		if (!entity) throw new Error('entity is required.');
		if (!id) throw new Error('id is required.');

		const response = await update({ entity, data: { delete: false }, where: { id } });
		res.send({ data: response, message: 'successfully restored.' });
	} catch (error) {
		res.status(500).send({ error: { message: error?.message } });
	}
});

// authorizations
// verify username is already exist
router.post('/checkUsername', async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) throw new Error('username is required.');

		const data = await getData({ entity: 'users', where: { username } });
		// return true if username is exist else false if not
		res.status(200).send({ exist: !!data.length });
	} catch (error) {
		console.log({ error });
		res.status(500).send({ error: { message: error?.message } });
	}
});

// User Registration Route
router.post('/auth/register', async (req, res) => {
	try {
		const { username, password } = req.body;
		// check if username is already exist
		const isExist = await getData({ entity: 'users', where: { username } });
		// throw error if username is already exist
		if (isExist.length) {
			return res.status(201).send({ error: { message: 'Username is already exist.' } });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await create({ entity: 'users', data: { username, password: hashedPassword } });

		// const token = await jwt.sign({ id: response.id, username: username }, process.env.JWT_SECRET, {
		// 	expiresIn: process.env.JWT_EXPIRES_IN
		// });

		// setToken(res, token);
		res.send({ message: 'Sign up success.' });
	} catch (error) {
		res.status(500).send({ error: { message: error?.message } });
	}
});

// User Login Route
router.post('/auth/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		// check if username is already exist
		const user = await getData({ entity: 'users', where: { username }, all: false });
		// throw error if username is not exist
		if (!user) {
			return res.status(201).send({ error: { message: 'Incorrect Username and Password.' } });
		}

		const correctPassword = await bcrypt.compare(password, user?.password);

		if (!correctPassword) return res.status(201).send({ error: { message: 'Incorrect Username and Password.' } });

		const token = await jwt.sign({ id: user.id, username: username }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN
		});

		setToken(res, token);
		// res.send({ message: 'Login success.', user: { id: user.id, username } });
		res.send({ message: 'Login success.' });
	} catch (error) {
		console.log('login error:', error);
		res.status(500).send({ error: { message: error?.message } });
	}
});

// Verify Token Route (Check JWT)
router.post('/auth/verifyToken', async (req, res, next) => {
	try {
		const decoded = await decodeToken(req);

		if (decoded?.statusCode !== 401) {
			setToken(res, decoded.token);
			// return
			const result = { valid: true, user: { id: decoded.id, username: decoded?.username } };
			return res.send(result);
		} else {
			return res.status(401).json({ valid: false, message: 'Invalid token' });
		}
	} catch (error) {
		console.log('verifyToken', { error });
		// remove token
		clearToken(res);
		if (error?.expiredAt) return res.status(401).json({ error: { expired: true, message: 'token expired' } });

		res.status(401).json({ error: { message: 'Invalid token' } });

		// res.status(500).send({ error: { message: error?.message } });
	}
});

router.post('/auth/logout', (req, res) => {
	try {
		clearToken(res);
		res.status(200).send({ logout: true, message: 'logged out successfully' });
	} catch (error) {
		res.status(500).send({ error: { message: error?.message } });
	}
});

module.exports = router;
