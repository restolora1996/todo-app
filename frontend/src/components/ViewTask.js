import React, { useEffect, useState } from 'react';
import { Box, Container, Divider, Grid2 as Grid, IconButton, Tooltip, Typography } from '@mui/material';

import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import { customStyle } from '@/utils/styles';
import moment from 'moment';

import Image from 'next/image';
import { styles } from '@/utils';
import Loader from './Loader';
import DeleteTaskModal from './DeleteTaskModel';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import { deleteTask } from '@/utils/api';
import { useAuth } from '@/context/UserContext';
import useFetchData from '@/hooks/useFetchData';
import Link from 'next/link';

const API_URL = process.env.UPLOAD_PATH || 'http://localhost:5000';

const ViewTask = ({ data }) => {
	const router = useRouter();
	const {
		state: { token }
	} = useAuth();
	const { setLoading } = useFetchData();
	const { showAlert } = useAlert();
	const [modal, setModal] = useState(false);

	const openModal = () => {
		setModal(true);
	};

	const onClose = () => {
		setModal(false);
	};

	const onDeleteTask = () => {
		try {
			deleteTask({ id: data.id }, token);
			setLoading(true);
			window.location = '/home';
			showAlert('Successfully deleted.');
			onClose();
		} catch (error) {
			console.log(error);
			showAlert('Something went wrong! Please try again later.', 'error');
		}
	};

	const onEditTask = () => {
		router.push(`/task/edit/${data.id}`);
	};

	return (
		<>
			{data && (
				<Box sx={customStyle.contentBody} style={{ maxHeight: '100vh' }}>
					<Box style={customStyle.viewTaskContent}>
						<Box className="mt-2">
							<Grid container rowSpacing={2} columnSpacing={1} className="mb-6">
								<Grid size={{ xs: 12, sm: 10, md: 6 }}>
									<Box className="flex justify-start items-center gap-4">
										<Image
											src={`/myassets/Icons/${data.priority}_table.svg`}
											width={50}
											height={50}
											alt={'High'}
											objectFit="cover"
										/>
										<Box sx={{ color: styles.secondary }}>
											<Grid container rowSpacing={0} columnSpacing={1}>
												<Grid item sm={12} md="auto">
													<Box className="flex gap-2 items-center">
														<Image
															src={`/myassets/Icons/${data?.status}.svg`}
															width={15}
															height={15}
															alt={data?.status}
														/>
														<Typography>{data?.status}</Typography>
													</Box>
												</Grid>

												{data?.status === 'Completed' && (
													<Grid item sm={12} md="auto">
														<Typography>- {moment(data.completionDate).format('DD MMM YYYY')}</Typography>
													</Grid>
												)}
											</Grid>
										</Box>
									</Box>
								</Grid>
								<Grid size={{ xs: 12, sm: 2, md: 6 }}>
									<Box className="flex justify-end gap-6">
										<Box className="flex gap-2" sx={{ color: styles.secondary }}>
											<Tooltip title="Delete">
												<IconButton variant="outlined" color="neutral" size="sm" onClick={() => openModal()}>
													<DeleteOutline color="neutral" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Edit">
												<IconButton variant="outlined" color="neutral" size="sm" onClick={() => onEditTask()}>
													<EditIcon color="neutral" />
												</IconButton>
											</Tooltip>
										</Box>
									</Box>
								</Grid>
								<Grid size={12}>
									<Box className="flex flex-col justify-start title">
										<Typography sx={{ color: styles.primary, fontSize: '20px', fontWeight: 'bold' }}>
											{data?.title}
										</Typography>
										<Typography sx={{ color: styles.secondary, fontSize: '14px' }}>
											{moment(data.dateCreated).format('DD MMM YYYY')} - {moment(data.dueDate).format('DD MMM YYYY')}
										</Typography>
									</Box>
									<Box className="description mt-6 mb-4">
										<Typography sx={{ color: styles.primary, fontSize: '16px' }}>{data?.description}</Typography>
									</Box>

									<Grid container rowSpacing={2} columnSpacing={2}>
										{data?.attachments?.length > 0 &&
											data.attachments.map(file => (
												<Grid item size={{ xs: 9, sm: 6, md: 4, lg: 3 }} key={file?.id}>
													<Box className="flex flex-col gap-2">
														<Box className="flex items-center h-[100px] w-[200px] overflow-hidden">
															<Link href={`${API_URL}${file?.fileName}`} target="_blank" rel="noopener noreferrer">
																<Image
																	src={`${API_URL}${file?.fileName}`}
																	width={200}
																	height={100}
																	objectFit="contain"
																	alt={file?.fileName}
																/>
															</Link>
														</Box>

														<Link
															className="mt-1"
															href={`${API_URL}${file?.fileName}`}
															target="_blank"
															rel="noopener noreferrer">
															<Typography sx={{ textDecoration: 'underline' }}>{file?.fileName}</Typography>
															<Typography sx={{ color: styles.secondary }}>{file?.fileSize}</Typography>
														</Link>
													</Box>
												</Grid>
											))}
									</Grid>
								</Grid>
							</Grid>
						</Box>
						<Divider />
						<Box className="mt-6 Subtasks w-[100%]">
							<Grid rowSpacing={2} columnSpacing={1}>
								<Grid size={{ xs: 12, sm: 12, md: 12 }}>
									<Box className="flex justify-start gap-6 mb-5">
										<Typography sx={{ color: styles.primary, fontSize: '18px', fontWeight: 'bold' }}>
											Subtask
										</Typography>
									</Box>
								</Grid>
								<Grid size={{ xs: 12, sm: 12, md: 12 }}>
									{data?.subtasks?.length > 0 ? (
										data?.subtasks.map(subtask => (
											<Box className="flex gap-12 mb-1 subtask-items" key={subtask.id}>
												<Typography sx={{ color: styles.primary, fontSize: '16px', width: '400px' }}>
													{subtask.title}
												</Typography>
												<Box className="flex items-center gap-2" sx={{ color: styles.secondary }}>
													<Image
														src={`/myassets/Icons/${subtask.status}.svg`}
														width={10}
														height={10}
														alt={subtask?.status}
													/>
													<Typography fontSize={16}>{subtask.status}</Typography>
												</Box>
											</Box>
										))
									) : (
										<Typography sx={{ color: styles.secondary, fontSize: '14px' }}>No subtasks.</Typography>
									)}
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Box>
			)}
			<DeleteTaskModal modal={modal} onClose={onClose} onSubmit={onDeleteTask} />
		</>
	);
};

export default ViewTask;
