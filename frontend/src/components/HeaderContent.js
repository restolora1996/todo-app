import { Box, Button, IconButton, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { styles } from '@/utils';

export const pageTitles = {
	Home: 'To-do',
	NewTask: 'New Task',
	View: 'View Task',
	Edit: 'Edit'
};

const HeaderContent = ({ page, onChangePage }) => {
	const disabled = ['Home', 'NewTask'].includes(page);

	return (
		<Box className="flex items-center gap-1">
			{page !== 'Home' && (
				<>
					<Box>
						<IconButton
							onClick={() => {
								if (page === 'Home') onChangePage('Home');
							}}
							color="primary"
							className="flex items-center"
							href="/home"
							aria-label="Home">
							<ArrowBackIosNewIcon sx={{ fontSize: '12px' }} />
							<Typography sx={{ fontSize: '20px', fontWeight: 500, marginLeft: '2px' }}>Back</Typography>
						</IconButton>
					</Box>
					<Typography sx={{ fontSize: 18, color: styles.secondary }}>|</Typography>
				</>
			)}

			<Breadcrumbs size="sm" aria-label="breadcrumbs" sx={{ pl: 0, borderLeft: `1px solid ${styles.divider}`, gap: 1 }}>
				{page === 'Edit' && (
					<Button disabled={disabled}>
						<Typography sx={{ fontSize: 20, color: styles.secondary }}>{pageTitles['View']}</Typography>
					</Button>
				)}
				<Button onClick={() => onChangePage(page)} disabled={disabled}>
					<Typography sx={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{pageTitles[page]}</Typography>
				</Button>
			</Breadcrumbs>
		</Box>
	);
};
export default HeaderContent;
