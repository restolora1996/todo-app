import React, { useCallback, useState } from 'react';
import { FilterAlt as FilterIcon, ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import { Menu, MenuItem, Button, ListItemIcon, Divider } from '@mui/material';
import { styles } from '@/utils';

export default function MenuFilter({ handleSetFilter }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [submenuAnchorEl, setSubmenuAnchorEl] = useState({});
	const menuList = [
		{
			value: 'priority',
			label: 'Priority',
			subItems: ['All', 'Low', 'High', 'Critical']
		},
		{ value: 'status', label: 'Status', subItems: ['All', 'Not started', 'In progress', 'Completed', 'Cancelled'] }
	];

	const handleMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = useCallback(
		({ field, value }) => {
			setAnchorEl(null);
			setSubmenuAnchorEl({});
			handleSetFilter({ field, value });
		},
		[handleSetFilter]
	);

	const handleSubmenuOpen = (event, index) => {
		setSubmenuAnchorEl(prev => ({ ...prev, [index]: event.currentTarget }));
	};

	const handleSubmenuClose = index => {
		setSubmenuAnchorEl(prev => ({ ...prev, [index]: null }));
	};

	return (
		<div>
			<Button
				onClick={handleMenuOpen}
				// endIcon={<ArrowDropDownIcon />}
				startIcon={<FilterIcon />}
				variant="outlined"
				color="neutral"
				size="sm"
				sx={{ width: '80px', borderRadius: '8px', borderColor: styles.secondary }}>
				Filter
			</Button>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
				{menuList.map((list, index) => (
					<MenuItem
						sx={{ borderBottom: `1px solid ${styles.dividers}` }}
						key={index}
						// onMouseEnter={event => handleSubmenuOpen(event, index)}
						onClick={event => handleSubmenuOpen(event, index)}
						onMouseLeave={() => handleSubmenuClose(index)}>
						{list.label}
						{list.subItems && (
							<Menu
								sx={{ ml: 1, overflow: 'hidden' }}
								anchorEl={submenuAnchorEl[index]}
								open={Boolean(submenuAnchorEl[index])}
								onClose={() => handleSubmenuClose(index)}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
								{list.subItems.map((subItem, subIndex) => (
									<MenuItem
										key={subIndex}
										onClick={() => handleMenuClose({ field: list.value, value: subItem })}
										sx={{ borderBottom: `1px solid ${styles.dividers}` }}>
										{subItem}
									</MenuItem>
								))}
							</Menu>
						)}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}
