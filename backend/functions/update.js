const db = require('../dbSequelize');

const update = async ({ entity = null, data = {}, where = {} }) => {
	try {
		// check if entity is exist
		if (!db[entity]) throw new Error('entity is not exist.');

		const table = db[entity];
		// insert query
		return await table.update(data, { where });
	} catch (error) {
		console.log('data update failed.');
		throw error;
	}
};
module.exports = update;
