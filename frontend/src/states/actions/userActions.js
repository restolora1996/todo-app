import { getToken, login, logout, verifyToken } from '@/utils/api';

const { actions } = require('./actionTypes');

const { USER } = actions;

export const setForm = (payload = null) => ({ type: USER.SETFORM, payload });
export const toggle = (payload = true) => ({ type: USER.TOGGLE, payload });

export const LOGIN = async (payload, dispatch) => {
	try {
		dispatch({ type: USER.START });

		const response = await login(payload);
		if (response?.error) {
			dispatch({ type: USER.FAIL, payload: response.error.message });
			return response;
		}

		const getToken = await fetch('/api/auth/getToken');
		if (!getToken.ok) throw new Error('No token found');

		const data = await getToken.json();

		dispatch({ type: USER.LOGIN, payload: { ...response, token: data.token } });
		return response;
	} catch (error) {
		const errorMessage = error?.response?.data?.error?.message || error?.message;
		dispatch({ type: USER.FAIL, payload: errorMessage });
		throw new Error(errorMessage);
	}
};

export const VERIFY = async (payload, dispatch) => {
	try {
		// dispatch({ type: USER.START });
		console.log(payload);
		let token = payload;
		if (!token) {
			const responseToken = await getToken();
			console.log(responseToken);
			token = responseToken.token;
		}
		console.log('token', token);
		const responseVerify = await verifyToken(token);

		dispatch({ type: USER.LOGIN, payload: { ...responseVerify, token } });
		return responseVerify;
	} catch (error) {
		const errorMessage = error?.response?.data?.error?.message || error?.message;
		dispatch({ type: USER.FAIL, payload: errorMessage });
		throw new Error(errorMessage);
	}
};

// export const LOGOUT = async (payload = { user: null, token: null }) => ({ type: USER.LOGIN, payload });
export const LOGOUT = async dispatch => {
	try {
		const response = await logout();
		dispatch({ type: USER.LOGOUT });
		return response;
	} catch (error) {
		const errorMessage = error?.response?.data?.error?.message || error?.message;
		dispatch({ type: USER.FAIL, payload: errorMessage });
		throw new Error(errorMessage);
	}
};
