'use client';

import EditTask from '@/components/EditTask';
import React, { useEffect, useState } from 'react';
import Wrapper from '@/components/Wrapper';
import { notFound, useParams } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';

const Edit = () => {
	const [page, setPage] = useState('Edit');
	const onChangePage = pageName => setPage(pageName);
	const { id } = useParams();
	const { data, loading, setLoading } = useFetchData(id);

	if (!data) {
		notFound(); // redirects to 404 page if no data found
	}

	return (
		<Wrapper page={page} onChangePage={onChangePage}>
			{!loading && <EditTask onChangePage={onChangePage} data={data} loading={loading} setLoading={setLoading} />}
		</Wrapper>
	);
};
export default Edit;
