const db = require('../dbSequelize');

const create = async ({ entity = null, data = [], include = null }) => {
	try {
		// check if entity is exist
		if (!db[entity]) throw new Error('entity is not exist.');
		// initialize table
		const table = db[entity];

		if (Array.isArray(data)) {
			// bulk creation of data
			return await table.bulkCreate([...data]);
		}

		if (include) {
			return await table.create(data, { ...include });
		}
		// single creation of data rest to add new associations eg. { include: ['subtasks'] }
		return await table.create(data);
	} catch (error) {
		console.log('data creation failed.');
		throw error;
	}
};
module.exports = create;
