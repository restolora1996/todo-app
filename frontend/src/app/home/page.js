'use client';
import React, { useState } from 'react';

import Wrapper from '@/components/Wrapper';

import NewTask from '@/components/NewTask';
import Todo from '@/components/Todo';

export default function Home() {
	const [page, setPage] = useState('Home');
	const onChangePage = pageName => setPage(pageName);

	return (
		<Wrapper page={page} onChangePage={onChangePage}>
			{/* home page */}
			{page === 'Home' && <Todo onChangePage={onChangePage} />}

			{/* New Task page */}
			{page === 'NewTask' && <NewTask onChangePage={onChangePage} />}
		</Wrapper>
	);
}
