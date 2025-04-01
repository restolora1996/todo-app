export const fileSizeToMB = fileSize => {
	return `${(fileSize / 1024 / 1024).toFixed(2)} MB`;
};
export const fileSizeToKB = fileSize => {
	return `${(fileSize / 1024).toFixed(2)} MB`;
};
