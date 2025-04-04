'use client';
import React from 'react';
import Image from 'next/image';

import { Box, Container } from '@mui/material';

const LoginLayout = ({ children }) => {
	return (
		<Box className="h-screen grid grid-cols-1 md:grid-cols-2">
			{/* Left Section with Background */}
			<Box
				className="w-[100%] h-[80%] md:h-[100%]   bg-cover bg-center flex items-center justify-center"
				style={{ backgroundImage: "url('/myassets/Wallpaper.svg')" }}>
				<Image src="/myassets/Brand and logo.svg" alt="Brand" width={300} height={200} />
			</Box>

			{/* Right Section - Login Form */}
			<Box className="w-[100%] h-[80%] md:h-[100%] flex items-center justify-center overflow-hidden">
				<Box className="p-10">
					<Container maxWidth="sm" sx={{ width: '100%' }}>
						{/* content here */}
						{children}
					</Container>
				</Box>
			</Box>
		</Box>
	);
};

export default LoginLayout;
