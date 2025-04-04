import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { logout } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import { customStyle } from '@/utils/styles';
import { useAlert } from '@/context/AlertContext';
import { useAuth } from '@/context/UserContext';

export default function SignOutModal({ modal, setModal }) {
	const router = useRouter();
	const { showAlert } = useAlert();
	const { signOut } = useAuth();

	const onSignOut = async () => {
		try {
			const response = await logout();
			if (response?.logout) {
				showAlert('Signout success. redirecting to login page.');
				signOut();
				handleClose();
				router.replace('/login');
			}
		} catch (error) {
			console.log(error);
			showAlert('Something went wrong! Please try again later.', 'error');
		}
	};

	const handleClose = () => {
		setModal(false);
	};

	return (
		<React.Fragment>
			<Dialog
				open={modal}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				style={{ zIndex: '10000' }}>
				<DialogTitle id="alert-dialog-title">{'Sign out'}</DialogTitle>
				<DialogContent className="w-[300px] flex flex-col justify-center">
					<Typography>Are you sure you want to signout?</Typography>
					<Typography>All unsaved changes will be lost.</Typography>
				</DialogContent>
				<DialogActions>
					<Button color="neutral" style={customStyle.primaryBtn} onClick={handleClose}>
						Cancel
					</Button>
					<Button color="neutral" style={customStyle.primaryBtn} onClick={onSignOut} autoFocus>
						Sign out
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
