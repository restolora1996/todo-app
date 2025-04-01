import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';

const AlertMessage = ({ open, message, duration = 1500, onClose, severity = 'success', position = 'right' }) => {
	return (
		<Snackbar
			color="outlined"
			anchorOrigin={{ vertical: 'top', horizontal: position }}
			onClose={onClose}
			open={open}
			autoHideDuration={duration}>
			{open && (
				<Alert onClose={onClose} severity={severity}>
					{message}
				</Alert>
			)}
		</Snackbar>
	);
};

AlertMessage.propTypes = {
	open: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	duration: PropTypes.number,
	onClose: PropTypes.func
};
export default AlertMessage;
