import { actions } from '../actions/actionTypes';

const { USER } = actions;

export const initialState = {
	user: null,
	token: null,
	loading: false,
	form: null,
	token: null,
	error: null,
	modal: false
};

export const userReducer = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case USER.START:
			return { ...state, user: null, loading: true };
		case USER.FAIL:
			return { ...state, error: payload, loading: false };

		case USER.LOGIN:
			return { ...state, user: payload?.user, token: payload?.token, loading: false, error: null };

		case USER.LOGOUT:
			return { ...state, user: null, token: null, loading: false };

		case USER.SETFORM:
			return { ...state, form: payload };

		case USER.TOGGLE:
			return { ...state, modal: payload };

		case USER.REGISTER:
			return { ...state, loading: false };

		default:
			state;
	}
};
