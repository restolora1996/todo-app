/**
 * function that will compare if value contains data.
 * @param {*} data - data to be compare not to contain
 * @param {*} value - value to compare to data that is not contains with.
 * @returns {boolean} - true if value contains data else false.
 */
export const valueContainsData = (data, value) => {
	for (let i = 0; i < data.length - 2; i++) {
		const substring = data.substring(i, i + 3);
		if (value.includes(substring)) {
			return true;
		}
	}
	return false;
};
