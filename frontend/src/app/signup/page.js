'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import debounce from 'lodash.debounce';

import Link from 'next/link';
import LoginLayout from '@/components/LoginLayout';
import { signup, validateUsername } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import { MEDIUM, STRONG, WEAK } from '@/utils/constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { valueContainsData } from '@/utils/helpers';

const Signup = () => {
	// const router = useRouter();
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [success, setSuccess] = useState(false);
	const [isUsernameExist, setisUsernameExist] = useState('');
	const { showAlert } = useAlert();

	// Define validation schema
	const schema = yup.object({
		username: yup
			.string()
			.min(3, 'Username must be 3 characters long')
			.matches(/^[a-zA-Z0-9\s!#()_'-]+$/, 'Invalid symbol, allowed symbols are letters, numbers, spaces, !#()_-')
			.required('Username is required')
			.test('username-exist', 'Username is already exist', value => {
				return success ? true : !isUsernameExist || true;
			}),
		password: yup
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.matches(/[\d!@#$%^&*(),.?":{}|<>]/, 'Password must contain a number or at least one special character')
			.required('Password is required')
			.test('no-username', 'Password should not cannot contain your username', value => {
				if (!value || !username) return true;
				// Check if password contains 3 consecutive characters from username
				return !valueContainsData(username, value);
			})
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange'
	});

	// Watch for form changes
	const username = watch('username', '');
	const password = watch('password', '');

	// Function to evaluate password strength
	const checkStrength = value => {
		const hasLetters = /[a-zA-Z]/.test(value);
		const hasNumbers = /\d/.test(value);
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

		if (value.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
			setPasswordStrength(STRONG); // Strong
		} else if (value.length >= 8 && hasLetters && hasNumbers) {
			setPasswordStrength(MEDIUM); // Medium
		} else {
			setPasswordStrength(WEAK); // Weak
		}
	};

	const onSubmit = async submitedData => {
		try {
			const response = await signup(submitedData);
			if (response?.data?.error) {
				throw new Error(response?.data?.error?.message);
			} else {
				setSuccess(true);
				// showAlert('Signup success, redirecting you to sign in page.');
				// setTimeout(() => {
				// 	router.push('/login');
				// }, 1000);
			}
		} catch (error) {
			console.log({ error });
			showAlert('Something went wrong! Please try again later.', 'error');
		}
	};

	// Check password strength rules
	const pwContainsUsername = password && username ? !valueContainsData(username, password) : false;

	const pwMinLength = password.length >= 8;
	const pwHasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

	const usernameExist = useMemo(
		() =>
			debounce(async data => {
				try {
					const response = await validateUsername({ username: data });
					if (response?.error || response?.data?.error) {
						alert(response?.error?.message || response?.data?.error?.message);
					} else {
						// Use functional update to ensure state is updated correctly
						setisUsernameExist(response?.data?.exist);
					}
				} catch (error) {
					console.log({ error });
				}
			}, 500),
		[setisUsernameExist]
	);

	useEffect(() => {
		checkStrength(password);
		if (!success && username && username.length >= 3) {
			// usernameExist.cancel(); // throw debounced function
			usernameExist(username);
		}
	}, [password, username, success, isUsernameExist, usernameExist]);

	const [showPassword, setShowPassword] = useState(false);

	const handleTogglePassword = () => {
		setShowPassword(prev => !prev);
	};

	return (
		<LoginLayout>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box sx={{ textAlign: 'left', mb: 3 }}>
					<Typography fontSize={34} fontWeight="bold">
						{!success ? 'Create an account' : 'Account successfully created. Sign in to continue'}
					</Typography>
				</Box>

				<TextField
					fullWidth
					label="Username"
					variant="outlined"
					margin="normal"
					{...register('username')}
					error={isUsernameExist || !!errors?.username}
					helperText={isUsernameExist ? 'Username is already exist' : errors?.username?.message}
				/>
				<TextField
					fullWidth
					label="Password"
					variant="outlined"
					margin="normal"
					{...register('password')}
					error={!!errors?.password}
					helperText={password && <>{passwordStrength}</>}
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={handleTogglePassword} edge="end">
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						)
					}}
				/>

				{/* Password Validation Rules */}
				<Box>
					<Container mt={2} sx={{ width: '100%' }}>
						<Typography className="flex items-center">
							{pwContainsUsername ? <CheckIcon fontSize="12" sx={{ color: '#027CEC' }} /> : '•'}
							<span style={{ marginLeft: 6 }}>Cannot contain your name or email address</span>
						</Typography>

						<Typography className="flex items-center">
							{pwMinLength ? <CheckIcon fontSize="12" sx={{ color: '#027CEC' }} /> : '•'}
							<span style={{ marginLeft: 6 }}>At least 8 characters</span>
						</Typography>

						<Typography className="flex items-center">
							{pwHasNumberOrSymbol ? <CheckIcon fontSize="12" sx={{ color: '#027CEC' }} /> : '•'}
							<span style={{ marginLeft: 6 }}>Contains a number or symbol</span>
						</Typography>
					</Container>
				</Box>

				<Button
					disabled={success}
					fullWidth
					variant="contained"
					type="submit"
					sx={{ mt: 2, bgcolor: '#027CEC', textTransform: 'none' }}>
					Sign in
				</Button>
			</form>

			<Typography sx={{ fontSize: '20px', fontWeight: '400', textAlign: 'center', mt: 2 }}>
				Already have an account?
				<Button
					variant="text"
					sx={{
						position: 'relative',
						bottom: '2px',
						right: '2px',
						textTransform: 'capitalize',
						'&:hover': { bgcolor: '#fff' }
					}}>
					<Link href="/login">
						<Typography fontSize={20} fontWeight="bold">
							Sign in
						</Typography>
					</Link>
				</Button>
			</Typography>
		</LoginLayout>
	);
};

export default Signup;
