'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Checkbox, Collapse, IconButton, TableSortLabel, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowDropDown, ArrowRight, DeleteOutline } from '@mui/icons-material';
import { customStyle } from '@/utils/styles';
import { deleteTask } from '@/utils/api';
import { useAuth } from '@/context/UserContext';
import { useAlert } from '@/context/AlertContext';
import DeleteTaskModal from './DeleteTaskModel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import moment from 'moment';
import { styles } from '@/utils';
import { visuallyHidden } from '@mui/utils';

const headerColumns = [
	{
		value: 'title',
		label: 'Title',
		sortable: false
	},
	{
		value: 'dueDate',
		label: 'Due Date',
		sortable: true
	},
	{
		value: 'priority',
		label: 'Priority',
		sortable: true
	},
	{
		value: 'status',
		label: 'Status',
		sortable: true
	}
];

export default function TableData({ data, setData, filter }) {
	const router = useRouter();
	const {
		state: { token },
		setFormData
	} = useAuth();
	const { showAlert } = useAlert();
	const [modal, setModal] = useState(false);
	const [selectedIds, setSelectedIds] = useState([]);
	const [order, setOrder] = React.useState({ direction: 'desc', by: 'dueDate' });

	const onSelectRow = (id, isSelected) => {
		setSelectedIds(prevSelected =>
			isSelected ? [...prevSelected, id] : prevSelected.filter(selectedId => selectedId !== id)
		);
	};

	const deleteSelectedIds = async () => {
		try {
			await deleteTask({ id: selectedIds }, token);
			showAlert('Successfully deleted.');

			const newData = data.filter(datum => !selectedIds.includes(datum.id));
			setData(newData);
			setModal(false);
			setSelectedIds([]);
		} catch (error) {
			console.log(error);
			showAlert('Something went wrong! Please try again later.', 'error');
		}
	};

	const openModal = () => {
		if (!selectedIds.length) return showAlert('No task selected.', 'warning', 'center');
		setModal(true);
	};

	const onClose = () => {
		setModal(false);
		setSelectedIds([]);
	};

	const onEditTask = data => {
		setFormData(data);
		router.push(`/task/edit/${data.id}`);
	};

	const handleRequestSort = (event, property) => {
		const isAsc = order.by === property && order.direction === 'asc';
		setOrder(isAsc ? { direction: 'desc', by: property } : { direction: 'asc', by: property });
	};

	const descendingComparator = (a, b, orderBy) => {
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	};

	const getComparator = useCallback((order, orderBy) => {
		return order === 'desc'
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy);
	}, []);

	const visibleRows = React.useMemo(() => {
		const filterPriority = filter.filter(item => item.field === 'priority').map(d => d.value);
		const filterStatus = filter.filter(item => item.field === 'status').map(d => d.value);
		return data
			.sort(getComparator(order.direction, order.by))
			.filter(datum => {
				const filtered = !!filterPriority.length
					? filterPriority.includes('All')
						? datum
						: filterPriority.includes(datum.priority)
					: datum;

				return filtered;
			})
			.filter(datum => {
				const filtered = !!filterStatus.length
					? filterStatus.includes('All')
						? datum
						: filterStatus.includes(datum.status)
					: datum;

				return filtered;
			});
	}, [data, getComparator, order, filter]);

	const createSortHandler = property => event => handleRequestSort(event, property);

	const Row = ({ row }) => {
		const [rowOpen, setRowOpen] = useState(false);

		let dueDateState = { color: styles.primary, value: '' };
		const completionDate = row.completionDate ? moment(row.completionDate).format('YYYY/MM/DD') : '';
		const due = moment(row.dueDate).format('YYYY-MM-DD');
		const dateToday = moment().format('YYYY-MM-DD');
		const difference = moment(dateToday).diff(due, 'hours');
		const notifyByStatus = ['Not started', 'In progress'];

		if (notifyByStatus.includes(row.status)) {
			if (difference >= -48 && difference <= 0 && row.priority === 'Critical') {
				dueDateState = {
					color: styles.critical,
					value: difference === -24 || difference === 0 ? 'Today' : 'Critical item'
				}; //48hrs b4 due critical
			} else if (difference === -24 || difference === 0) {
				dueDateState = { color: styles.mainButtons, value: 'Today' }; //24hrs b4 due today
			} else if (difference > 0) {
				dueDateState = { color: styles.critical, value: 'Overdue' }; //overdue
			}
		}
		return (
			<>
				<TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
					<TableCell component="th" scope="row">
						<Checkbox
							color="primary"
							onChange={e => onSelectRow(row.id, e.target.checked)}
							checked={selectedIds.includes(row.id)}
							inputProps={{
								'aria-labelledby': 'Delete'
							}}
						/>
					</TableCell>
					<TableCell align="left">
						<Box className="flex justify-start items-center">
							{row?.subtasks?.length > 0 && (
								<IconButton
									sx={{ position: 'relative', right: '5px' }}
									size="small"
									onClick={() => setRowOpen(prev => !prev)}>
									{rowOpen ? <ArrowDropDown fontSize="10px" /> : <ArrowRight fontSize="10px" />}
								</IconButton>
							)}
							<Link href={`task/view/${row.id}`} sx={{ position: 'relative', left: '10px' }}>
								<Typography
									sx={{
										fontSize: '14px',
										fontWeight: 'bold',
										textDecoration: 'underline',
										...(!row?.subtasks?.length && { position: 'relative', left: '27px' })
									}}>
									{row.title}
								</Typography>
							</Link>
						</Box>
					</TableCell>
					<TableCell align="left">
						<Box sx={{ color: dueDateState.color }}>
							<Typography fontSize={14}>{row.dueDate}</Typography>
							<Typography fontSize={10}>{dueDateState.value}</Typography>
						</Box>
					</TableCell>
					<TableCell align="left">
						<Image
							src={`/myassets/Icons/${row.priority}_table.svg`}
							width={50}
							height={50}
							alt={row.priority}
							objectFit="cover"
						/>
					</TableCell>
					<TableCell align="left">
						<Box>
							<Box className="flex gap-2">
								<Image src={`/myassets/Icons/${row.status}.svg`} width={20} height={40} alt={row.status} />
								{row.status}
							</Box>
							{row.status === 'Completed' && (
								<Typography fontSize={14} sx={{ color: styles.secondary, marginLeft: '25px' }}>
									{completionDate}
								</Typography>
							)}
						</Box>
					</TableCell>
					<TableCell align="left">
						<Tooltip title="Edit">
							<IconButton
								variant="outlined"
								color="neutral"
								size="sm"
								onClick={() => {
									onEditTask(row);
								}}>
								<EditIcon />
							</IconButton>
						</Tooltip>
					</TableCell>
				</TableRow>
				{row?.subtasks?.length > 0 && (
					<TableRow>
						<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
							<Collapse in={rowOpen} timeout="auto" unmountOnExit>
								<Box sx={{ margin: 1 }}>
									<Table size="small" aria-label="statuses">
										<TableBody>
											{row?.subtasks?.map(sub => (
												<TableRow key={`status-key-${sub.id}`}>
													<TableCell width="10%"></TableCell>
													<TableCell width="65%" colSpan={5}>
														<Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>{sub?.title || ''}</Typography>
													</TableCell>
													<TableCell width="25%" colSpan={2}>
														<Box className="flex gap-2">
															<Image
																src={`/myassets/Icons/${sub.status}.svg`}
																width={20}
																height={40}
																alt={sub.status}
															/>
															{sub.status}
														</Box>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Box>
							</Collapse>
						</TableCell>
					</TableRow>
				)}
			</>
		);
	};

	return (
		<Box sx={customStyle.contentBody}>
			<TableContainer component={Paper} sx={{ overflow: 'auto' }}>
				<Table size="small" sx={{ minWidth: 650 }} aria-label="a dense table">
					<TableHead>
						<TableRow hover>
							<TableCell>
								<Tooltip title="Delete">
									<IconButton color="neutral" onClick={openModal}>
										<DeleteOutline color="neutral" />
										{selectedIds.length > 0 && (
											<Typography sx={customStyle.selectedTaskCount}>{selectedIds.length}</Typography>
										)}
									</IconButton>
								</Tooltip>
							</TableCell>
							{/* <TableCell align="left" width="10%"></TableCell> */}
							{headerColumns.length > 0 &&
								headerColumns.map((col, i) => {
									return !col?.sortable ? (
										<TableCell align="left" key={i}>
											<Typography sx={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '25px' }}>
												{col.label}
											</Typography>
										</TableCell>
									) : (
										<TableCell align="left" key={i} sortDirection={order.by === col.value ? order.direction : false}>
											<TableSortLabel
												active={order.by === col.value}
												direction={order.by === col.value ? order.direction : 'asc'}
												onClick={createSortHandler(col.value)}
												sx={{ fontSize: '16px', fontWeight: 'bold' }}>
												{order.by === col.value ? (
													<Box component="span" sx={visuallyHidden}>
														{order.direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
													</Box>
												) : null}
												{col.label}
											</TableSortLabel>
										</TableCell>
									);
								})}
							<TableCell align="left">
								<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}></Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{visibleRows.map(row => {
							return <Row row={row} key={row.id} />;
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<DeleteTaskModal taskNumber={selectedIds.length} modal={modal} onClose={onClose} onSubmit={deleteSelectedIds} />
		</Box>
	);
}
