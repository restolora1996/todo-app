'use client';

import React, { useState } from 'react';
import Wrapper from '@/components/Wrapper';
import { notFound, useParams } from 'next/navigation';
import ViewTask from '@/components/ViewTask';
import useFetchData from '@/hooks/useFetchData';
import Loader from '@/components/Loader';

const View = () => {
	const { id } = useParams();
	const [page, setPage] = useState('View');
	const onChangePage = pageName => setPage(pageName);
	const { data, loading } = useFetchData(id);

	if (!data && loading) {
		notFound(); // redirects to 404 page if no data found
	}

	return loading ? (
		<Loader />
	) : (
		data && (
			<Wrapper page={page} onChangePage={onChangePage}>
				<ViewTask data={data} loading={loading} />
			</Wrapper>
		)
	);
};
export default View;
