import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader() {
	return (
		<Box className="flex gap-2 items-center justify-center w-[100%]">
			<CircularProgress /> Loading...
		</Box>
	);
}
