import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import MenuIcon from '@mui/icons-material/Menu';

import { toggleSidebar } from '../utils';
import { customStyle } from '@/utils/styles';
import { Paper, Button, IconButton } from '@mui/material';

export default function Header() {
	return (
		<Paper sx={customStyle.header}>
			<GlobalStyles
				styles={theme => ({
					':root': {
						'--Header-height': '52px',
						[theme.breakpoints.up('md')]: {
							'--Header-height': '0px'
						}
					}
				})}
			/>
			<IconButton onClick={() => toggleSidebar()} variant="outlined" color="neutral" size="sm">
				<MenuIcon />
			</IconButton>
		</Paper>
	);
}
