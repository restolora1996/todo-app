import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Link, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Image from 'next/image';

const API_URL = process.env.UPLOAD_PATH || 'http://localhost:5000';

const Attachment = ({ attachments, setValue, error, helperText }) => {
	const [files, setFiles] = useState([]);

	// Load existing attachments from API
	useEffect(() => {
		if (attachments?.length > 0) {
			const existingFiles = attachments.map(file => {
				if (file?.fileName) {
					return {
						id: file?.id,
						name: file?.fileName?.split('/').pop(), // Extract filename
						size: parseFloat(file?.fileSize?.split(' ')[0]) * 1024 * 1024, // Convert MB to bytes
						type: file?.fileName?.endsWith('.png') ? 'image/png' : 'image/jpeg', // Assume image (modify based on actual data)
						preview: `${API_URL}${file?.fileName}` // Construct API URL
					};
				} else {
					return file;
				}
			});
			setFiles(existingFiles);
		}
	}, [attachments]);

	const onDrop = useCallback(
		acceptedFiles => {
			// Add preview URL for images
			const newFiles = acceptedFiles.map(file =>
				Object.assign(file, {
					preview: URL.createObjectURL(file)
				})
			);
			// set file value
			const updatedFiles = [...newFiles, ...files].filter(file => file.preview);
			setFiles(updatedFiles);
			setValue('attachments', updatedFiles);
		},
		[files, setValue]
	);
	// Remove file from the list
	const removeFile = fileName => {
		const filteredFiles = files.filter(file => file?.name !== fileName);
		setFiles(filteredFiles);
		setValue('attachments', filteredFiles);
	};
	// dropzone props
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<Box sx={{ width: '100%' }}>
			<Typography variant="subtitle1" sx={{ mb: 1, color: '#6c757d' }}>
				Attachments
			</Typography>

			{/* Dropzone Area */}
			<Box
				{...getRootProps()}
				sx={{
					p: 3,
					border: '1px dashed #adb5bd',
					borderRadius: '6px',
					backgroundColor: isDragActive ? '#f8f9fa' : '#ffffff',
					textAlign: 'center',
					cursor: 'pointer',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center'
				}}>
				<input {...getInputProps()} />
				<CloudUploadIcon sx={{ fontSize: 30, color: '#adb5bd', mb: 1 }} />
				<Typography variant="body2" sx={{ color: '#6c757d' }}>
					Drop files to attach, or{' '}
					<Link href="#" sx={{ color: '#0d6efd', textDecoration: 'none' }}>
						browse
					</Link>
					.
				</Typography>
			</Box>

			{/* Error message */}
			{error && <Typography color="error">{helperText}</Typography>}

			{/* File Preview List */}
			{files.length > 0 && (
				<Paper sx={{ mt: 2, p: 2 }}>
					<List>
						{files.map((file, index) => (
							<ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
								{/* Show image preview if it's an image */}
								{file.preview && file?.type?.startsWith('image/') ? (
									<Image src={file.preview} alt={file.name} width={50} height={50} style={{ marginRight: 10 }} />
								) : (
									<Typography variant="body2" sx={{ marginRight: 2 }}>
										{file.name}
									</Typography>
								)}

								<ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
								<IconButton onClick={() => removeFile(file.name)} color="error">
									<DeleteIcon />
								</IconButton>
							</ListItem>
						))}
					</List>
				</Paper>
			)}
		</Box>
	);
};

export default Attachment;
