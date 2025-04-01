'use client';

import { Button, Divider, Typography } from '@mui/material';
import Image from 'next/image';

export const socialButtons = {
	mt: 1,
	borderColor: '#272D32',
	bgcolor: '#fff',
	color: '#272D32',
	textTransform: 'capitalize',
	fontSize: '16',
	'&:hover': { bgcolor: '#027CEC', color: '#fff' }
};

export default function SocialMedias() {
	return (
		<>
			<Divider textAlign="center">
				<Typography variant="body2" fontSize={14}>
					OR
				</Typography>
			</Divider>
			<Button fullWidth variant="outlined" sx={socialButtons}>
				<Image src="/myassets/Icons/Google.svg" alt="google" width={25} height={15} />
				<span className="ml-2">Continue with Google</span>
			</Button>
			<Button fullWidth variant="outlined" sx={socialButtons}>
				<Image src="/myassets/Icons/Facebook.svg" alt="facebook" width={25} height={15} />
				<span className="ml-2">Continue with Facebook</span>
			</Button>
		</>
	);
}
