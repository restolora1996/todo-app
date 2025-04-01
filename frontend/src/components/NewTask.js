import {
	Box,
	Button,
	Container,
	Divider,
	Grid2 as Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	TextField,
	Tooltip,
	Typography
} from '@mui/material';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import React, { useCallback, useEffect, useState } from 'react';
import { DeleteOutline } from '@mui/icons-material';
import { customStyle } from '@/utils/styles';
import Attachment from './Attachment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import moment from 'moment';
import { useAuth } from '@/context/UserContext';
import { createTask } from '@/utils/api';
import { useAlert } from '@/context/AlertContext';
import SubTaskForm from './SubTaskForm';
import { priorities, statusList, tenMB, validImageType } from '@/utils/constants';

const NewTask = ({ onChangePage }) => {
	// const { userData, token } = useAuth();
	const {
		state: { user, token }
	} = useAuth();
	const { showAlert } = useAlert();

	const today = moment().format('YYYY-MM-DD');
	// Define validation schema
	const schema = yup.object({
		title: yup.string().max(25, 'Must be atleast 25 characters long').required('Must not be empty.'),
		dateCreated: yup.string().required('Must not be empty.'),
		dueDate: yup
			.string()
			.required('Must not be empty.')
			.test('later-dateCreated', 'Must be later than Date Created', value => {
				return moment(today).format('YYYY-MM-DD') < moment(value).format('YYYY-MM-DD');
			}),
		status: yup.string().optional(),
		priority: yup.string().optional(),
		description: yup.string().max(300, 'Must be atleast 300 characters long').optional(),
		subtasks: yup.array().of(
			yup.object().shape({
				title: yup.string().trim().required('Must not be empty')
			})
		),
		attachments: yup
			.array()
			.max(5, 'Maximum of 5 uploaded files are allowed')
			.test('fileType', 'Only PNG and JPG files are allowed', files => {
				return files.length ? files.every(file => validImageType.includes(file?.type)) : true;
			})
			.test('fileSize', 'Each file must be less than 10MB', files => {
				return files.length ? files.every(file => file.size <= tenMB) : true;
			})
			.optional()
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
		defaultValues: {
			status: 'Not started',
			priority: 'Low',
			title: '',
			dateCreated: today,
			description: '',
			attachments: [],
			subtasks: []
		}
	});
	// Watch subtasks array
	const subtasks = watch('subtasks');

	const onSubmit = async data => {
		try {
			console.log({ ...data, user_id: user?.id }, token);
			const response = await createTask({ ...data, user_id: user?.id }, token);

			if (response?.error || response?.data?.error) {
				const message = response?.error?.message || response?.data?.error?.message;
				showAlert(message);
				return;
			} else {
				showAlert('Successfully saved.');
				// back to home page
				onChangePage('Home');
			}
		} catch (error) {
			console.log({ error });
			showAlert('Something went wrong! Please try again later.');
		}
	};

	const onDeleteSubTask = useCallback(
		data => {
			const filterSubTask = subtasks.filter((_, index) => index !== data);
			setValue('subtasks', filterSubTask);
		},
		[setValue, subtasks]
	);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box sx={customStyle.contentBody}>
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
										defaultValue="Low"
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
									<TextField
										fullWidth
										id="Status"
										variant="outlined"
										select
										label="Status"
										{...register('status')}
										defaultValue="Not started"
										error={!!errors?.status}
										helperText={errors?.status?.message}>
										{statusList.map(option => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid size={{ xs: 12, sm: 12, md: 12 }}>
									<TextField
										className="w-[100%]"
										multiline
										rows={2}
										label="Title"
										id="Title"
										variant="outlined"
										{...register('title')}
										error={!!errors?.title}
										helperText={errors?.title?.message}
										slotProps={{ htmlInput: { maxLength: 25 } }}
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
										register={register}
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
							errors={errors}
							onDeleteSubTask={onDeleteSubTask}
						/>
					</Container>
				</Box>
				<Box className="w-[100%] flex justify-end gap-2 pt-5 pr-10">
					<Button
						color="primary"
						variant="outlined"
						size="medium"
						onClick={() => onChangePage('Home')}
						sx={{ ...customStyle.mainBtn, borderRadius: '25px', borderWidth: '2px', width: '100px' }}>
						Cancel
					</Button>

					<Button
						type="submit"
						color="primary"
						variant="contained"
						size="medium"
						sx={{ ...customStyle.whiteBtn, borderRadius: '25px', borderWidth: '2px', width: '100px' }}>
						Save
					</Button>
				</Box>
			</form>
		</>
	);
};

export default NewTask;
