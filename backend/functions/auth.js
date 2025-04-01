const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// JWT Middleware to authenticate
async function verifyToken(req, res, next) {
	try {
		await decodeToken(req, res);
		next();
	} catch (error) {
		if (error?.expiredAt) {
			// remove token
			res.clearCookie('token', {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'Strict'
			});

			return res.status(401).json({ error: { expired: true, message: 'token expired' } });
		}
		res.status(401).json({ error: { message: 'Invalid token' } });
	}
}

async function decodeToken(req, res) {
	const token = req?.cookies?.token || req.header('Authorization')?.split(' ')[1];

	if (!token) return res.status(401).json({ message: 'Unauthorized' });

	const decoded = await jwt.verify(token, process.env.JWT_SECRET);
	return { ...decoded, token };
}

/**
 * clear token
 * @param {object} res - context response
 * @returns none
 */
function clearToken(res) {
	res.clearCookie('token', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'Strict'
	});
}

/**
 * set token to user
 * @param {object} res - context response
 * @param {string} token - token
 * @param {number} maxAge - expiration in milliseconds - 3600000 (1hr)
 * @returns none
 */
function setToken(res, token, maxAge = 3600000) {
	// set cookie token
	res.cookie('token', token, {
		httpOnly: true, // Prevents JavaScript access (XSS protection)
		secure: true, // Use only on HTTPS
		sameSite: 'Strict',
		maxAge: maxAge // 1 hour
	});
}

module.exports = { verifyToken, decodeToken, setToken, clearToken };
