import { Box, Button, IconButton, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { styles } from '@/utils';
import { useRouter } from 'next/navigation';

export const pageTitles = {
	Home: 'To-do',
	NewTask: 'New Task',
	View: 'View Task',
	Edit: 'Edit'
};

const HeaderContent = ({ page, onChangePage }) => {
	const disabled = ['Home', 'NewTask'].includes(page);
	const router = useRouter();

	return (
		<Box className="flex items-center gap-1">
			{page !== 'Home' && (
				<>
					<Box>
						<IconButton
							onClick={() => {
								if (page === 'NewTask') {
									onChangePage('Home');
								} else {
									router.back({ shallow: true });
								}
							}}
							color="primary"
							className="flex items-center"
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
