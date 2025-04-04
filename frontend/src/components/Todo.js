import React, { useCallback, useState } from 'react';
import { Box, Button, Chip, Stack, Grid2 as Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TableData from '@/components/TableData';
import MenuFilter from '@/components/MenuFilter';
import { customStyle } from '@/utils/styles';
import { styles } from '@/utils';
import useFetchData from '@/hooks/useFetchData';
import Loader from './Loader';

const Todo = ({ onChangePage }) => {
	const { data, setData, loading } = useFetchData();
	const [filter, setFilter] = useState([]);

	const handleDelete = index => {
		const newFilter = filter.filter((_, i) => i !== index);
		setFilter(newFilter);
	};

	const handleSetFilter = useCallback(({ field, value }) => {
		setFilter(prev => {
			const existing = prev.find(item => item.field === field && item.value === value);
			return existing ? [...prev] : [...prev, { field, value }];
		});
	}, []);
                                                                                                                                                                                                                                                                                                                                                         
	return (
		<Box>
			<Box
				sx={{
					...customStyle.contentHeader,
					flexDirection: { xs: 'column', sm: 'row' },
					justifyContent: { xs: 'end', sm: 'space-between' }
				}}>
				<Stack className="items-center" direction={{ xs: 'column', sm: 'row' }} spacing={1}>
					<Grid container spacing={1} alignItems={'center'}>
						<Grid item>
							<MenuFilter handleSetFilter={handleSetFilter} />
						</Grid>
						{filter.length > 0 &&
							filter.map((item, i) => {
								return (
									<Grid item key={i}>
										<Chip
											label={item.value}
											variant="outlined"
											onDelete={e => {
												handleDelete(i);
											}}
										/>
									</Grid>
								);
							})}
					</Grid>
				</Stack>

				<Button
					color="primary"
					variant="contained"
					startIcon={<AddIcon fontSize="12px" />}
					size="medium"
					sx={{
						// alignSelf: 'flex-end',
						fontSize: '12px',
						textTransform: 'capitalize',
						borderRadius: '25px',
						background: styles.mainButtons
					}}
					onClick={() => onChangePage('NewTask')}>
					New Task
				</Button>
			</Box>
			{loading ? <Loader /> : <TableData data={data} setData={setData} filter={filter} />}
		</Box>
	);
};

export default Todo;
