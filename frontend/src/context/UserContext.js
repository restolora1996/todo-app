'use client';

import { verifyToken } from '@/utils/api';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const initialState = { user: null, token: null, loading: true, form: null };

	const [state, setState] = useState(initialState);
	const [userData, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);
	// edit data
	const [form, setForm] = useState(null);
	const setFormData = data => {
		setState(prevState => ({ ...prevState, form: data }));
		setForm(data);
	};

	const resetFormData = () => {
		setState(prevState => ({ ...prevState, form: null }));
		setForm(null);
	};

	const signIn = async data => {
		setState(prevState => ({ ...prevState, user: data?.user }));
		setUser(data.user);
		await fetchToken();
	};
	const signOut = () => {
		setState(prevState => ({ ...prevState, user: null, token: null }));
		setUser(null);
		setToken(null);
	};

	// Fetch token from API route
	const fetchToken = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/getToken', { credentials: 'include' });
			if (!response.ok) throw new Error('No token found');
			const data = await response.json();
			setToken(data?.token);
			setState(prevState => ({ ...prevState, token: data?.token }));
		} catch (error) {
			setLoading(false);
			setToken(null);
			setState(prevState => ({ ...prevState, token: null, loading: false }));
		}
	}, []);

	const verify = useCallback(async token => {
		try {
			if (token) {
				const response = await verifyToken(token);
				// throw error invalid
				if (!response?.user) throw new Error('Invalid token');
				setUser(response);
				setLoading(false);
				setState(prevState => ({ ...prevState, user: response.user, loading: false }));
			}
		} catch (error) {
			console.log('verify', error);
			setState(prevState => ({ ...prevState, user: null, loading: false }));
			if (error?.response.data?.error?.expired) {
				window.location = '/login';
				alert('Your session has expired. Please sign in again.', 'error');
			}
			console.log('Token verification failed:', error.message);
		}
	}, []);

	useEffect(() => {
		fetchToken();
	}, [fetchToken]);

	useEffect(() => {
		if (token) verify(token);
	}, [token, verify]);

	console.log('state', state);
	return (
		<UserContext.Provider
			value={{ state, loading, userData, token, signIn, signOut, form, setFormData, resetFormData, verify }}>
			{loading ? (
				<div className="w-[100vw] h-[100vh] flex items-center jusify-center">
					<Loader />
				</div>
			) : (
				children
			)}
		</UserContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(UserContext);
};

export const useVerifyToken = () => {
	const { token, verify } = useContext(UserContext);

	useEffect(() => {
		if (token) verify(token);
	}, [token, verify]);
};
