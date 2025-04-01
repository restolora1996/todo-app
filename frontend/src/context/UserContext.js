'use client';

import { verifyToken } from '@/utils/api';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const initialState = { user: null, token: null, loading: true, form: null };

	const [state, setState] = useState(initialState);

	const setFormData = data => {
		setState(prevState => ({ ...prevState, form: data }));
	};

	const resetFormData = () => {
		setState(prevState => ({ ...prevState, form: null }));
	};

	const signIn = async data => {
		setState(prevState => ({ ...prevState, user: data?.user }));
		await fetchToken();
	};

	const signOut = () => {
		setState(prevState => ({ ...prevState, user: null, token: null }));
	};

	// Fetch token from API route
	const fetchToken = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/getToken', { credentials: 'include' });
			if (!response.ok) throw new Error('No token found');
			const data = await response.json();

			setState(prevState => ({ ...prevState, token: data?.token }));
		} catch (error) {
			setState(prevState => ({ ...prevState, token: null, loading: false }));
		}
	}, []);

	const verify = useCallback(async token => {
		try {
			if (token) {
				const response = await verifyToken(token);
				// throw error invalid
				if (!response?.user) throw new Error('Invalid token');

				setState(prevState => ({ ...prevState, user: response.user, token, loading: false }));
			}
		} catch (error) {
			console.log('verify', error);
			setState(prevState => ({ ...prevState, user: null, loading: false }));

			if (error?.response.data?.error?.expired) {
				window.location = '/login';
				alert('Your session has expired. Please sign in again.');
			}
			console.log('Token verification failed:', error.message);
		}
	}, []);

	useEffect(() => {
		fetchToken();
	}, [fetchToken]);

	useEffect(() => {
		const token = state.token;

		if (token) verify(token);
	}, [state.token, verify]);

	return (
		<UserContext.Provider value={{ state, setState, signIn, signOut, setFormData, resetFormData, verify }}>
			{state.loading ? <Loader /> : children}
		</UserContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(UserContext);
};
