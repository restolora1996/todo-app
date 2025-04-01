'use client';
import React, { useEffect, useState } from 'react';

import Wrapper from '@/components/Wrapper';

import NewTask from '@/components/NewTask';
import Todo from '@/components/Todo';
import EditTask from '@/components/EditTask';
import ViewTask from '@/components/ViewTask';

export default function Home() {
	const [page, setPage] = useState('Home');
	const onChangePage = pageName => setPage(pageName);

	return (
		<Wrapper page={page} onChangePage={onChangePage}>
			{/* home page */}
			{page === 'Home' && <Todo onChangePage={onChangePage} />}

			{/* New Task page */}
			{page === 'NewTask' && <NewTask onChangePage={onChangePage} />}

			{/* Edit Task page */}
			{/* {page === 'EditTask' && <EditTask onChangePage={onChangePage} />} */}

			{/* View Task page */}
			{/* {page === 'ViewTask' && <ViewTask onChangePage={onChangePage} />} */}
		</Wrapper>
	);
}
