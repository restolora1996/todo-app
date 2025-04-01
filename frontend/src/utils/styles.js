import { listItemButtonClasses } from '@mui/material';
import { styles } from '.';

export const customStyle = {
	mainContent: {
		px: { xs: 2, md: 6, lg: 2 },
		pt: {
			xs: 'calc(12px + var(--Header-height))',
			sm: 'calc(12px + var(--Header-height))',
			md: 3,
			lg: 2
		},
		pb: { xs: 2, sm: 2, md: 3, lg: 2 },
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		minWidth: 0,
		height: '100vh',
		maxHeight: '100vh',
		overflow: 'auto',
		gap: 1,
		background: styles.bgContent
	},
	header: {
		display: { xs: 'flex', md: 'none' },
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'fixed',
		top: 0,
		width: '100vw',
		height: 'var(--Header-height)',
		zIndex: 9995,
		p: 2,
		gap: 1,
		borderBottom: '1px solid',
		borderColor: 'background.level1',
		boxShadow: 'sm'
	},
	contentHeader: {
		display: 'flex',
		mb: 1,
		gap: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		background: '#fff',
		borderRadius: '15px',
		border: '1px solid ' + styles.dividers,
		padding: '10px 10px'
	},
	contentBody: {
		display: 'flex',
		mb: 1,
		gap: 1,
		flexDirection: { xs: 'column', sm: 'row' },
		flexWrap: 'wrap',
		// justifyContent: 'space-between',
		background: '#fff',
		borderRadius: '15px',
		border: '1px solid ' + styles.dividers,
		padding: '10px 10px'
	},
	newTaskContent: {
		width: '70vw',
		padding: '20px 15px 20px 15px'
	},
	viewTaskContent: {
		width: '90vw',
		padding: '20px',
		height: '85vh'
	},
	sideBar: {
		position: { xs: 'fixed', md: 'sticky' },
		transform: {
			xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
			md: 'none'
		},
		transition: 'transform 0.4s, width 0.4s',
		zIndex: 10000,
		height: '100dvh',
		width: 'var(--Sidebar-width)',
		top: 0,
		p: 2,
		flexShrink: 0,
		display: 'flex',
		flexDirection: 'column',
		gap: 2,
		borderRight: '1px solid',
		borderColor: 'divider'
	},
	sideBarOverlay: {
		position: 'fixed',
		zIndex: 9998,
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		opacity: 'var(--SideNavigation-slideIn)',
		backgroundColor: 'var(--joy-palette-background-backdrop)',
		transition: 'opacity 0.4s',
		transform: {
			xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
			lg: 'translateX(-100%)'
		}
	},
	capitalize: {
		textTransform: 'capitalize'
	},
	drawerContent: {
		minHeight: 0,
		overflow: 'hidden auto',
		flexGrow: 1,
		display: 'flex',
		flexDirection: 'column',
		[`& .${listItemButtonClasses.root}`]: {
			gap: 1
		}
	},
	secondaryBtn: {
		color: styles.secondary,
		fontSize: '16px',
		fontWeight: 'bold'
	},
	primaryBtn: {
		color: styles.primary,
		fontSize: '16px',
		fontWeight: 'bold'
	},
	whiteBtn: {
		color: styles.white,
		fontSize: '16px',
		fontWeight: 'bold'
	},
	mainBtn: {
		color: styles.mainButtons,
		fontSize: '16px',
		fontWeight: 'bold'
	},
	fontBlack: {
		color: '#000',
		fontSize: '16px'
	},
	selectedTaskCount: {
		position: 'absolute',
		left: '32px',
		top: '10px',
		color: styles.white,
		background: styles.mainButtons,
		padding: '2px 7px',
		borderRadius: '10px',
		fontSize: '12px'
	}
};
