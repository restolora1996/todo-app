import { useCallback, useEffect, useState } from 'react';
import { useAlert } from '@/context/AlertContext';
import { useAuth } from '@/context/UserContext';
import { getTask, getTaskById } from '@/utils/api';
import { useRouter } from 'next/navigation';

const useFetchData = (id = null) => {
	const {
		state: { token }
	} = useAuth();
	const { showAlert } = useAlert();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			const response = await getTask(token);
			setData(response);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setError(error.message || 'error fetching data');
		}
	}, [token]);

	const fetchById = useCallback(async () => {
		try {
			const response = await getTaskById(id, token);

			setData(response[0]);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
			if (error?.response.data?.error?.expired) {
				window.location = '/login';
				alert('Your session has expired. Please sign in again.', 'error');
			}
			showAlert('Error fetching data', 'error');
			setError(error.message || 'error fetching data');
		}
	}, [id, showAlert, token]);

	useEffect(() => {
		if (!token) return;

		if (!id) {
			fetchData();
		} else {
			fetchById();
		}
	}, [fetchById, fetchData, id, token]);

	return { data, setData, error, loading, setLoading };
};

export default useFetchData;
