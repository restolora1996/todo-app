import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader({ height = '85vh' }) {
	return (
		<Box className="w-[100%] h-[85vh] flex items-center jusify-center" style={{ height }}>
			<Box className="flex gap-2 items-center justify-center w-[100%]">
				<CircularProgress /> Loading...
			</Box>
		</Box>
	);
}
