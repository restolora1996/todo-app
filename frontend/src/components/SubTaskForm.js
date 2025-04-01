import React, { useCallback } from 'react';
import { Add as AddIcon, DeleteOutline } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useAlert } from '@/context/AlertContext';

const SubTaskForm = ({ control, subtasks, setValue, errors, status, openModal }) => {
	// const onDeleteSubTask = useCallback(
	// 	data => {
	// 		const filterSubTask = subtasks.filter((_, index) => index !== data);
	// 		setValue('subtasks', filterSubTask);
	// 	},
	// 	[setValue, subtasks]
	// );
	const { showAlert } = useAlert();

	const addNewtask = () => {
		if (subtasks?.length + 1 <= 10) {
			setValue('subtasks', [{ title: '', status: 'Not done' }, ...subtasks]);
		} else {
			showAlert('Maximum of 10 subtasks are allowede to create.', 'error');
		}
	};

	const onChangeStatus = useCallback(
		(value, index) => {
			const updatedSubTask = subtasks.map((subtask, i) => (i === index ? { ...subtask, status: value } : subtask));
			// setSubTasks(updatedSubTask);
			setValue('subtasks', updatedSubTask);
		},
		[setValue, subtasks]
	);

	const onChangeTitle = useCallback(
		(value, index) => {
			const updatedSubTask = subtasks.map((subtask, i) => (i === index ? { ...subtask, title: value } : subtask));
			setValue('subtasks', updatedSubTask);
		},
		[setValue, subtasks]
	);

	return (
		<>
			<Box className="flex w-[100%] justify-between mt-6">
				<Box>
					<Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Subtask</Typography>
				</Box>
				<Box>
					<Button
						color="primary"
						variant="outlined"
						startIcon={<AddIcon fontSize="16" />}
						size="medium"
						sx={{
							fontSize: '16px',
							borderRadius: '25px',
							fontWeight: 'bold'
						}}
						onClick={addNewtask}
						disabled={status === 'Completed'}>
						New Subtask
					</Button>
				</Box>
			</Box>
			<Box className="w-full mt-2 mb-2">
				<Box maxWidth="lg">
					{/* Headers */}
					{subtasks?.length > 0 && (
						<div className="grid grid-cols-12 gap-2 mb-2">
							<div className="col-span-6 text-left">Title</div>
							<div className="col-span-4 text-left">Status</div>
							<div className="col-span-2"></div> {/* Empty for spacing */}
						</div>
					)}

					{/* Subtasks */}
					{subtasks?.map((subtask, index) => (
						<div className="grid grid-cols-12 gap-2 items-center mb-2" key={index}>
							<div className="col-span-6">
								<Controller
									name={`subtasks.${index}.title`}
									control={control}
									render={({ field }) => (
										<FormControl fullWidth sx={{ minHeight: '80px' }}>
											<TextField
												{...field}
												fullWidth
												variant="outlined"
												label="Title"
												onChange={e => onChangeTitle(e.target.value, index)}
												error={!!errors?.subtasks?.[index]?.title}
												helperText={errors?.subtasks?.[index]?.title?.message || ' '}
											/>
										</FormControl>
									)}
								/>
							</div>
							<div className="col-span-4">
								<FormControl fullWidth sx={{ minHeight: '80px' }}>
									<TextField
										defaultValue="Not done"
										value={subtask.status}
										fullWidth
										variant="outlined"
										select
										onChange={e => onChangeStatus(e.target.value, index)}
										id={`status-${index}`}>
										<MenuItem value="Not done">Not done</MenuItem>
										<MenuItem value="In progress">In progress</MenuItem>
										<MenuItem value="Done">Done</MenuItem>
									</TextField>
								</FormControl>
							</div>
							<div className="col-span-2 flex justify-center">
								<FormControl fullWidth sx={{ minHeight: '50px' }}>
									<Tooltip
										title="Delete"
										id={`delete-${index}`}
										onClick={() => openModal({ index, title: subtask?.title })}>
										<IconButton type="button" variant="outlined" color="neutral" size="small">
											<DeleteOutline />
										</IconButton>
									</Tooltip>
								</FormControl>
							</div>
						</div>
					))}
				</Box>
			</Box>
		</>
	);
};

export default SubTaskForm;
