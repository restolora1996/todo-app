import React, { useState } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { closeSidebar } from '../utils';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/UserContext';
import { customStyle } from '@/utils/styles';
import SignOutModal from './SignOutModal';

export default function Sidebar() {
	const router = useRouter();
	const {
		state: { user }
	} = useAuth();
	const [modal, setModal] = useState(false);

	const menuItems = [
		{ key: 'home', text: 'Home', icon: <HomeRoundedIcon />, path: '/home' },
		{ key: 'signout', text: 'Sign out', icon: <LogoutRoundedIcon />, path: '/login' }
	];

	const drawerContent = (
		<>
			<List
				size="sm"
				sx={{
					padding: 0,
					'--List-nestedInsetStart': '30px',
					'--ListItem-radius': '10px'
				}}
				dense>
				{menuItems.map(item => (
					<ListItem key={item.key}>
						<ListItemButton
							onClick={async () => {
								if (item.key === 'signout') {
									setModal(true);
								} else {
									router.push(item.path);
								}
							}}>
							{item.icon}
							<ListItemText>
								<Typography level="title-sm">{item.text}</Typography>
							</ListItemText>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</>
	);
	return (
		<>
			<Paper
				className="Sidebar"
				sx={{
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
				}}>
				<GlobalStyles
					styles={theme => ({
						':root': {
							'--Sidebar-width': '220px',
							[theme.breakpoints.up('lg')]: {
								'--Sidebar-width': '240px'
							}
						}
					})}
				/>
				<Box
					className="Sidebar-overlay"
					sx={{
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
					}}
					onClick={() => closeSidebar()}
				/>
				<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '30px' }}>
					<Link href="/home">
						<Image src="/myassets/Logo Header.svg" width={100} height={60} alt="Logo" style={{ objectFit: 'fill' }} />
					</Link>
				</Box>
				{user && (
					<>
						<Divider />
						<Box className="flex flex-col items-center center" sx={{ gap: 0.5, width: '100%' }}>
							<Avatar variant="outlined" size="sm" alt={user?.username} src="/broken-image.jpg" />
							<Box sx={{ minWidth: 0 }}>
								<Typography level="title-sm">{user?.username}</Typography>
							</Box>
						</Box>
					</>
				)}

				<Divider />
				<Box sx={customStyle.drawerContent}>{drawerContent}</Box>
			</Paper>
			<SignOutModal modal={modal} setModal={setModal} />
		</>
	);
}
