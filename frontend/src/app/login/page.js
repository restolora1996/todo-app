'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Box, Button, TextField, Typography } from '@mui/material';
import { login } from '@/utils/api';
import { useRouter } from 'next/navigation';
import LoginLayout from '@/components/LoginLayout';
import { useAuth } from '@/context/UserContext';
import { useAlert } from '@/context/AlertContext';
import { LOGIN } from '@/states/actions/userActions';

const Login = () => {
	const router = useRouter();

	const {
		state: { token },
		signIn,
		dispatch
	} = useAuth();

	const { showAlert } = useAlert();

	const { register, handleSubmit } = useForm();

	const onSubmit = async submittedData => {
		try {
			// const response = await signIn(submittedData);
			const response = await LOGIN(submittedData, dispatch);
			// const response = await login(submittedData);
			if (response?.error || response?.data?.error) {
				const message = response?.error?.message || response?.data?.error?.message;
				showAlert(message, 'error');
				return;
			} else {
				signIn(response);
				showAlert('Login success.');
				// router.push('/home');
			}
		} catch (error) {
			console.log('login error', { error });
			showAlert(error.message, 'error');

			// showAlert('Something went wrong! Please try again later.', 'error');
		}
	};

	useEffect(() => {
		if (token) router.replace('/home');
	}, [router, token]);

	return (
		<LoginLayout>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box sx={{ textAlign: 'center', mb: 3 }}>
					<Typography fontSize={34} fontWeight="bold">
						Sign In
					</Typography>
				</Box>

				<TextField fullWidth label="Username" variant="outlined" margin="normal" {...register('username')} />
				<TextField
					fullWidth
					label="Password"
					type="password"
					variant="outlined"
					margin="normal"
					{...register('password')}
				/>

				<Button
					className="capitalize"
					fullWidth
					variant="contained"
					type="submit"
					sx={{ mt: 2, bgcolor: '#027CEC', textTransform: 'none' }}>
					Sign in
				</Button>
			</form>

			<Typography fontWeight="medium" sx={{ fontSize: '20px', fontWeight: '400', textAlign: 'center', mt: 2 }}>
				{`Don't you have an account?`}
				<Button
					variant="text"
					sx={{
						position: 'relative',
						bottom: '2px',
						right: '2px',
						textTransform: 'capitalize',
						'&:hover': { bgcolor: '#fff' }
					}}>
					<Link href={'/signup'}>
						<Typography fontSize={20} fontWeight="bold">
							Sign up
						</Typography>
					</Link>
				</Button>
			</Typography>
		</LoginLayout>
	);
};

export default Login;
