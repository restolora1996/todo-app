'use client';
import React, { useEffect, useRef } from 'react';
import Header from './Header';
import Sidebar from './SideBar';
import { styles } from '@/utils';

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { customStyle } from '@/utils/styles';
import { Box, CssBaseline } from '@mui/material';
import HeaderContent from './HeaderContent';

const MuiTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: styles.mainButtons,
			color: '#FFFFFF'
		}
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					'&.MuiButton-containedPrimary': {
						backgroundColor: styles.mainButtons
					}
				}
			}
		}
	}
});

export default function WrapperDashboard({ children, page, onChangePage }) {
	const [mounted, setMounted] = React.useState(false);

	useEffect(() => {
		setMounted(true);
	}, [mounted]);

	if (!mounted) return null; // Avoid rendering on the server

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={MuiTheme}>
				<CssBaseline />
				<Box sx={{ display: 'flex', minHeight: '100vh' }}>
					<Header />
					<Sidebar />
					<Box className="MainContent" sx={customStyle.mainContent}>
						<HeaderContent page={page} onChangePage={onChangePage} />
						{/* content */}
						{children}
					</Box>
				</Box>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}
