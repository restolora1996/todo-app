'use client';

import { verifyToken } from '@/utils/api';
import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import Loader from '@/components/Loader';
import { initialState, userReducer } from '@/states/reducers/userReducer';
import { LOGIN, VERIFY } from '@/states/actions/userActions';
import { usePathname } from 'next/navigation';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const pathName = usePathname();
	const [stateReducer, dispatch] = useReducer(userReducer, initialState);
	console.log('stateReducer', stateReducer);

	// const initialState = { user: null, token: null, loading: true, form: null };

	const [state, setState] = useState(initialState);
	console.log(state);

	const setFormData = data => {
		setState(prevState => ({ ...prevState, form: data }));
	};

	const resetFormData = () => {
		setState(prevState => ({ ...prevState, form: null }));
	};

	const signIn = async data => {
		// console.log({ data });
		// return await LOGIN(data, dispatch);
		setState(prevState => ({ ...prevState, user: data?.user }));
		// await fetchToken();
	};

	const signOut = () => {
		setState(prevState => ({ ...prevState, user: null, token: null }));
	};

	const setLoading = value => {
		setState(prevState => ({ ...prevState, loading: value }));
	};

	// // Fetch token from API route
	// const fetchToken = useCallback(async () => {
	// 	try {
	// 		const response = await fetch('/api/auth/getToken', { credentials: 'include' });
	// 		if (!response.ok) throw new Error('No token found');
	// 		const data = await response.json();

	// 		setState(prevState => ({ ...prevState, token: data?.token }));
	// 		return data.token;
	// 	} catch (error) {
	// 		setState(prevState => ({ ...prevState, token: null, loading: false }));
	// 	}
	// }, []);

	// const verify = useCallback(async token => {
	// 	try {
	// 		if (token) {
	// 			const response = await verifyToken(token);
	// 			// throw error invalid
	// 			if (!response?.user) throw new Error('Invalid token');

	// 			setState(prevState => ({ ...prevState, user: response.user, token, loading: false }));
	// 		}
	// 	} catch (error) {
	// 		setState(prevState => ({ ...prevState, user: null, loading: false }));

	// 		if (error?.response.data?.error?.expired) {
	// 			window.location = '/login';
	// 			alert('Your session has expired. Please sign in again.');
	// 		}
	// 		console.log('Token verification failed:', error.message);
	// 	}
	// }, []);

	// useEffect(() => {
	// 	if (!pathName.includes('login')) {
	// 		fetchToken();
	// 	}
	// }, [fetchToken, pathName]);

	// useEffect(() => {
	// 	const token = state.token;

	// 	if (token && !pathName.includes('login')) {
	// 		verify(token);
	// 	}
	// }, [pathName, state.token, verify]);

	const checkToken = useCallback(async token => {
		try {
			const response = await VERIFY(token, dispatch);

			// throw error invalid
			if (!response?.valid) throw new Error('Invalid token');
		} catch (error) {
			console.log('check', error);
			if (error?.response?.data?.error?.expired) {
				window.location = '/login';
				alert('Your session has expired. Please sign in again.');
			}
			console.log('Token verification failed:', error.message);
		}
	}, []);

	useEffect(() => {
		const token = stateReducer.token;
		if (token || !pathName.includes('login')) {
			checkToken(token);
		}
	}, [stateReducer.token, checkToken, pathName]);

	return state.loading ? (
		<Loader />
	) : (
		<UserContext.Provider
			value={{
				// stateReducer,
				dispatch,
				// state,
				state: stateReducer,
				setState,
				setLoading,
				signIn,
				signOut,
				setFormData,
				resetFormData
				// verify
			}}>
			{children}
		</UserContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(UserContext);
};
