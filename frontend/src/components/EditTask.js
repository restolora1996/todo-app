import { Box, Button, Container, Divider, Grid2 as Grid, MenuItem, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import { DeleteOutline } from '@mui/icons-material';
import { customStyle } from '@/utils/styles';
import Attachment from './Attachment';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import moment from 'moment';
import { useAuth } from '@/context/UserContext';
import { updateTask } from '@/utils/api';
import { useAlert } from '@/context/AlertContext';
import SubTaskForm from './SubTaskForm';
import { useRouter } from 'next/navigation';
import { priorities, statusList, tenMB, validImageType } from '@/utils/constants';
import DeleteSubTaskModal from './DeleteSubTaskModal';
import { styles } from '@/utils';

const EditTask = ({ data: form, setLoading }) => {
	const router = useRouter();
	const {
		state: { user, token }
	} = useAuth();
	const { showAlert } = useAlert();
	const [markComplete, setMarkComplete] = useState(false);
	const [subTaskAreDone, setSubTasksAreDone] = useState(false);
	const [modal, setModal] = useState(false);
	const [subtaskId, setSubtaskId] = useState(null);
	const today = moment().format('YYYY-MM-DD');

	// Define validation schema
	const schema = yup.object({
		title: yup.string().max(25, 'Must be atleast 25 characters long').required('Must not be empty.'),
		dateCreated: yup.string().required('Must not be empty.'),
		dueDate: yup
			.string()
			.required('Must not be empty.')
			.test('later-dateCreated', 'Must be later than Date Created', value => {
				return moment(form?.dateCreated).format('YYYY-MM-DD') < moment(value).format('YYYY-MM-DD');
			}),
		status: yup.string().optional(),
		priority: yup.string().optional(),
		description: yup.string().max(300, 'Must be atleast 300 characters long').optional(),
		attachments: yup
			.array()
			.max(5, 'Maximum of 5 uploaded files are allowed')
			.test('fileType', 'Only PNG and JPG files are allowed', files => {
				return files.length
					? files.every(file =>
							file?.type
								? validImageType.includes(file?.type) // file type is acquired
								: validImageType.includes(file?.fileName?.split('.').at(-1))
						)
					: true;
			})
			.test('fileSize', 'Each file must be less than 10MB', files => {
				return files.length
					? files.every(file => (file?.size || parseFloat(file?.fileSize?.split(' ')[0])) <= tenMB)
					: true;
			})
			.optional(),
		subtasks: yup.array().of(
			yup.object().shape({
				title: yup.string().trim().required('Must not be empty')
			})
		)
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		watch,
		setValue
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: form
	});
	// Watch subtasks array
	const subtasks = watch('subtasks');
	const status = watch('status');
	const attachments = watch('attachments');

	// update completionDate if status is
	useEffect(() => {
		if (status === 'Completed') {
			const completionDate = form.completionDate ? moment(form.completionDate).format('YYYY-MM-DD') : '';
			setValue('completionDate', completionDate ? completionDate : today);
		} else {
			setValue('completionDate', '');
		}

		if (subtasks?.length > 0) {
			const allDone = subtasks?.filter(sub => sub.status !== 'Done').length === 0;
			if (status !== 'Completed') {
				setSubTasksAreDone(allDone);
				setMarkComplete(allDone);
			} else {
				if (!allDone) {
					setValue('status', form.status);
				}
			}
		}
	}, [status, setValue, today, form, subtasks]);

	const onMarkComplete = e => {
		e.preventDefault();
		setMarkComplete(prev => !prev);
		setValue('status', 'Completed');
	};

	const onSubmit = async data => {
		try {
			if (data.status !== 'Completed') {
				delete data.completionDate;
			} else {
				data.completionDate = moment(data.completionDate).format('YYYY-MM-DD HH:MM:SS');
			}

			const response = await updateTask({ ...data, user_id: user?.id }, token);
			if (response?.error || response?.data?.error) {
				const message = response?.error?.message || response?.error?.data?.error?.message;
				showAlert(message);
			} else {
				showAlert('Successfully saved.');
				router.push('/home', undefined, { shallow: true }); // back to home page
				// setLoading(false);
			}
		} catch (error) {
			console.log({ error });
			showAlert('Something went wrong! Please try again later.', 'error');
			// setLoading(false);
		}
	};

	//open modal
	const openModal = id => {
		setModal(true);
		setSubtaskId(id);
	};
	//close modal
	const onClose = () => {
		setModal(false);
		setSubtaskId(null);
	};

	const onDeleteSubTask = useCallback(
		e => {
			e.preventDefault();
			const filterSubTask = subtasks.filter((_, index) => index !== subtaskId?.index);
			setValue('subtasks', filterSubTask);

			onClose();
		},
		[setValue, subtasks, subtaskId]
	);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box sx={customStyle.contentBody} style={{ maxHeight: '90vh', overflow: 'auto' }}>
					<Container style={customStyle.newTaskContent}>
						<Box className="mb-8">
							<Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<TextField
										fullWidth
										id="Priority"
										variant="outlined"
										select
										label="Priority"
										defaultValue={form?.priority || 'Low'}
										disabled
										{...register('priority')}
										error={!!errors?.priority}
										helperText={errors?.priority?.message}>
										{priorities.map(option => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<Controller
										name="status"
										control={control}
										defaultValue={form?.status || 'Low'}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												variant="outlined"
												select
												label="Status"
												error={!!errors?.status}
												helperText={errors?.status?.message}>
												{statusList.map(({ value, label }) => (
													<MenuItem
														key={value}
														value={value}
														disabled={value === 'Completed' ? (subtasks?.length > 0 ? !subTaskAreDone : false) : false}>
														{label}
													</MenuItem>
												))}
											</TextField>
										)}
									/>
								</Grid>
								{status === 'Completed' && (
									<Grid size={{ xs: 12, sm: 6, md: 3 }}>
										<TextField
											fullWidth
											label="Completion Date"
											disabled
											id="completionDate"
											variant="outlined"
											type="date"
											{...register('completionDate')}
											slotProps={{ inputLabel: { shrink: true } }}
										/>
									</Grid>
								)}

								<Grid size={{ xs: 12, sm: 12, md: 12 }}>
									<TextField
										className="w-[100%]"
										multiline
										rows={2}
										label="Title"
										id="Title"
										variant="outlined"
										// sx={{ fontSize: '20px', fontWeight: 'bold' }}
										{...register('title')}
										error={!!errors?.title}
										helperText={errors?.title?.message}
										slotProps={{ htmlInput: { maxLength: 25 } }}
										disabled
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 6 }}>
									<TextField
										fullWidth
										label="Date Created"
										disabled
										id="DateCreated"
										variant="outlined"
										type="date"
										{...register('dateCreated')}
										error={!!errors?.dateCreated}
										helperText={errors?.dateCreated?.message}
										slotProps={{ inputLabel: { shrink: true } }}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 6 }}>
									<TextField
										fullWidth
										label="Due Date"
										id="DueDate"
										variant="outlined"
										type="date"
										{...register('dueDate')}
										error={!!errors?.dueDate}
										helperText={errors?.dueDate?.message}
										slotProps={{ inputLabel: { shrink: true } }}
									/>
								</Grid>
								<Grid size={12}>
									<TextField
										className="w-[100%]"
										multiline
										rows={4}
										label="Details (optional)"
										id="Details (optional)"
										variant="outlined"
										{...register('description')}
										error={!!errors?.description}
										helperText={errors?.description?.message}
										slotProps={{ htmlInput: { maxLength: 300 } }}
									/>
								</Grid>
								<Grid size={12}>
									<Attachment
										attachments={attachments}
										setValue={setValue}
										error={!!errors?.attachments}
										helperText={errors?.attachments?.message}
									/>
								</Grid>
							</Grid>
						</Box>
						<Divider />
						<SubTaskForm
							control={control}
							subtasks={subtasks}
							register={register}
							setValue={setValue}
							status={status}
							errors={errors}
							onDeleteSubTask={onDeleteSubTask}
							openModal={openModal}
						/>
					</Container>
				</Box>
				<Box className="container w-[100%] flex justify-end gap-4">
					<Button
						color="primary"
						variant="outlined"
						size="medium"
						href="/home"
						sx={{ ...customStyle.mainBtn, borderRadius: '25px', borderWidth: '2px', width: '100px' }}>
						Cancel
					</Button>
					{subtasks?.length > 0 && markComplete && subTaskAreDone ? (
						<Button
							type="button"
							color="primary"
							variant="contained"
							size="medium"
							sx={{
								...customStyle.whiteBtn,
								borderRadius: '25px',
								borderWidth: '2px',
								width: '200px'
							}}
							onClick={onMarkComplete}>
							Mark as Complete
						</Button>
					) : (
						<Button
							type="submit"
							color="primary"
							variant="contained"
							size="medium"
							sx={{ ...customStyle.whiteBtn, borderRadius: '25px', borderWidth: '2px', width: '100px' }}>
							Save
						</Button>
					)}
				</Box>
			</form>
			<DeleteSubTaskModal
				content={
					<>
						<Typography
							sx={{
								color: styles.primary,
								fontSize: '16px'
							}}>
							Delete this Subtask?
						</Typography>
						<Typography
							sx={{
								color: styles.primary,
								textDecoration: 'underline',
								fontWeight: 'bold',
								fontSize: '20px'
							}}>
							{subtaskId?.title || ''}
						</Typography>
					</>
				}
				modal={modal}
				onClose={onClose}
				onSubmit={onDeleteSubTask}
			/>
		</>
	);
};

export default EditTask;
