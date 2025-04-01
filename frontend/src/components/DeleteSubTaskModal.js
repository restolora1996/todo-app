import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Box, IconButton, Typography } from '@mui/material';
import { customStyle } from '@/utils/styles';
import { Close } from '@mui/icons-material';
import Image from 'next/image';

export default function DeleteSubTaskModal({ content = null, modal, onClose, onSubmit }) {
	return (
		<React.Fragment>
			<Dialog
				open={modal}
				onClose={onClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="deleteModal rounded-sm!"
				style={{ zIndex: '10000', borderRadius: '20px !important' }}>
				{/* <DialogTitle id="alert-dialog-title">{'Sign out'}</DialogTitle> */}
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={theme => ({
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme.palette.grey[500]
					})}>
					<Close />
				</IconButton>
				<DialogContent className="w-80 flex flex-col justify-center items-center gap-3 ">
					{/* <DialogContentText id="alert-dialog-description"> */}
					<Typography className="mt-4!">
						<Image src="/myassets/Icons/Alert.svg" alt="alert icon" width={35} height={35} />
					</Typography>
					<Box sx={customStyle.fontBlack} className="w-[80%]! text-center gap-1.5 content body">
						{content}
					</Box>
					{/* </DialogContentText> */}
				</DialogContent>
				<DialogActions className="w-[100%] justify-center! pt-0! pb-5!">
					<Button
						color="primary"
						variant="outlined"
						size="medium"
						sx={{ ...customStyle.mainBtn, borderRadius: '25px', borderWidth: '2px', width: '100px' }}
						onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="button"
						color="primary"
						variant="contained"
						size="medium"
						sx={{ ...customStyle.whiteBtn, borderRadius: '25px', borderWidth: '2px', width: '100px' }}
						onClick={onSubmit}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
