'use client';
import React from 'react';
import Image from 'next/image';

import { Box, Container } from '@mui/material';
import SocialMedias from '@/components/SocialMedias';

const LoginLayout = ({ children }) => {
	return (
		<Box className="h-screen flex">
			{/* Left Section with Background */}
			<Box
				className="w-1/2 bg-cover bg-center flex items-center justify-center"
				style={{ backgroundImage: "url('/myassets/Wallpaper.svg')" }}>
				<Image src="/myassets/Brand and logo.svg" alt="Brand" width={300} height={200} />
			</Box>

			{/* Right Section - Login Form */}
			<Box className="w-1/2 flex items-center justify-center">
				<Box className="p-15 w-[40vw]">
					<Container maxWidth="sm" sx={{ width: '100%' }}>
						{/* content here */}
						{children}
						{/* social media login */}
						{/* <SocialMedias /> */}
					</Container>
				</Box>
			</Box>
		</Box>
	);
};

export default LoginLayout;
