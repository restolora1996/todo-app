const db = require('../dbSequelize');

const getData = async ({ entity = null, id = null, where = {}, all = true, ...rest }) => {
	try {
		const table = db[entity];

		if (!table) throw new Error('entity is not exist.');

		let whereValues = where;
		let includes = {};

		if (entity === 'todos') {
			includes = {
				include: Object.keys(table.associations)
					.map(assoc => (db[assoc] ? { model: db[assoc], as: assoc } : false))
					.filter(d => d)
			};
		}

		// id is set return data by id
		if (id) whereValues = { id, ...where };

		// return all data
		if (all) {
			return await table.findAll({
				where: whereValues,
				...includes,
				...rest
			});
		}

		// one data return
		return await table.findOne({
			where: whereValues,
			...includes,
			...rest
		});
	} catch (error) {
		console.log('getData', { error });
		throw error;
	}
};
module.exports = getData;
