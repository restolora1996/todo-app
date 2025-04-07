import axios from 'axios';
const api = axios.create({ baseURL: process.env.API });

// Login Function
export const login = async data => {
	try {
		const response = await api.post('/auth/login', data, { withCredentials: true });
		return response?.data;
	} catch (error) {
		// console.error('Login failed', error);
		throw error;
	}
};

export const getUser = async () => {
	try {
		const response = await api.get('/users', { withCredentials: true });
		console.log('getUser', response);
		return response?.data;
	} catch (error) {
		console.log('getUser', error);
		throw error;
	}
};

export const getToken = async () => {
	try {
		const response = await axios.get('/api/auth/getToken', { withCredentials: true });
		return response?.data;
	} catch (error) {
		console.log('getToken', error);
		throw error;
	}
};

export const verifyToken = async token => {
	try {
		const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
		const response = await api.post('/auth/verifyToken', {}, { headers, withCredentials: true });

		return response.data;
	} catch (error) {
		console.log('verifyToken:', error);
		throw error;
	}
};

export const logout = async () => {
	try {
		const response = await api.post('/auth/logout', {}, { withCredentials: true });
		return response?.data;
	} catch (error) {
		throw error;
	}
};

export const signup = async data => {
	try {
		const response = await api.post('/auth/register', data, {
			withCredentials: true
		});
		return response;
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

export const validateUsername = async payload => {
	try {
		const response = await api.post('/checkUsername', payload);
		return response;
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

export const formData = payload => {
	const setFormData = new FormData();
	Object.keys(payload).map(key => {
		if (Array.isArray(payload[key])) {
			// Check if it's an array of files (attachments)
			if (payload[key].some(item => item instanceof File)) {
				// Append files one by one (keep them as actual files)

				payload[key].forEach(item => {
					if (item instanceof File) {
						setFormData.append(`${key}[]`, item);
					} else {
						setFormData.append(`${key}[]`, JSON.stringify(item));
					}
				});
			} else {
				// Otherwise, stringify non-file arrays (subtasks, etc.)
				setFormData.append(key, JSON.stringify(payload[key]));
			}
		} else if (typeof payload[key] === 'object' && payload[key] !== null) {
			// set payload of object
			setFormData.append(key, JSON.stringify(payload[key]));
		} else {
			// set normal form data
			setFormData.append(key, payload[key]);
		}
	});
	return setFormData;
};

// crud
export const createTask = async (payload, token) => {
	try {
		const data = formData(payload);

		const response = await api.post('/create/todos', data, {
			headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
			withCredentials: true
		});

		return response;
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

export const getTask = async token => {
	try {
		const response = await api.get('/todos', {
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			withCredentials: true
		});
		return response.data;
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

export const getTaskById = async (id, token) => {
	try {
		const response = await api.get(`/todos/${id}`, {
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			withCredentials: true
		});
		return response.data;
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

export const updateTask = async (payload, token) => {
	try {
		const data = formData(payload);

		const response = await api.put(`/update/todos/${payload.id}`, data, {
			headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
			withCredentials: true
		});
		return response;
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

export const deleteTask = async (payload, token) => {
	try {
		console.log(payload, token);
		const response = await api.put('/delete/todos', payload, {
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			withCredentials: true
		});
		return response.data;
	} catch (error) {
		console.log({ error });
		throw error;
	}
};
