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
		setState(prevState => ({ ...prevState, user: data?.user || null }));
		fetchToken();
	};

	const signOut = () => {
		setState(prevState => ({ ...prevState, user: null, token: null }));
	};

	const setLoading = value => {
		setState(prevState => ({ ...prevState, loading: value }));
	};

	// Fetch token from API route
	const fetchToken = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/getToken', { credentials: 'include' });
			if (!response.ok) throw new Error('No token found');
			const data = await response.json();

			setState(prevState => ({ ...prevState, token: data?.token }));
			return data.token;
		} catch (error) {
			setState(prevState => ({ ...prevState, token: null, loading: false }));
		}
	}, [setState]);

	const verify = useCallback(async token => {
		try {
			if (token) {
				const response = await verifyToken(token);
				// throw error invalid
				if (!response?.user) throw new Error('Invalid token');

				setState(prevState => ({ ...prevState, user: response.user, token, loading: false }));
			}
		} catch (error) {
			setState(prevState => ({ ...prevState, user: null, loading: false }));

			if (error?.response?.data?.error?.expired) {
				window.location = '/login';
				alert('Your session has expired. Please sign in again.');
			}

			window.location = '/login';
			alert('Something went wrong. Please sign in again.');
			console.log('Token verification failed:', error.message);
		}
	}, []);

	useEffect(() => {
		const token = state.token;

		if (!token) fetchToken();
	}, [fetchToken, state.token]);

	useEffect(() => {
		const token = state.token;

		if (token) {
			verify(token);
		}
	}, [state.token, verify, fetchToken]);

	return state.loading ? (
		<Loader />
	) : (
		<UserContext.Provider value={{ state, setState, setLoading, signIn, signOut, setFormData, resetFormData, verify }}>
			{children}
		</UserContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(UserContext);
};
