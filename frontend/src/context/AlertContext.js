'use client';

import AlertMessage from '@/components/AlertMessage';
import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
	const initialState = { open: false, mesage: '', severity: 'success', position: 'center' };
	const [alert, setAlert] = useState(initialState);

	const showAlert = (message, severity = 'success', position = 'center') => {
		setAlert({ open: true, message, severity, position });
	};

	const onClose = () => {
		setAlert(initialState);
	};

	return (
		<AlertContext.Provider value={{ alert, showAlert }}>
			{children}
			<AlertMessage
				message={alert?.message}
				open={alert?.open}
				duration={1500}
				onClose={onClose}
				severity={alert?.severity}
				position={alert?.position}
			/>
		</AlertContext.Provider>
	);
};

// Custom hook to use the alert context
export const useAlert = () => useContext(AlertContext);
