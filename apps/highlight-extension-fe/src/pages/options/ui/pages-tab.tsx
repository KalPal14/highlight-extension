import React, { useEffect, useState } from 'react';
import { Accordion } from '@chakra-ui/react';

import { TGetPagesRo } from '~libs/ro/highlight-extension';

import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';
import { usePages } from '~/highlight-extension-fe/entities/page';

import { PageItem } from './forms/page-item';

export function PagesTab(): JSX.Element {
	const { currentWorkspace } = useWorkspaces().data;
	const { getPages } = usePages().actions;

	const [pages, setPages] = useState<TGetPagesRo>([]);

	useEffect(() => {
		getPagesInfo();
	}, [currentWorkspace]);

	async function getPagesInfo(): Promise<void> {
		try {
			const pages = await getPages();
			setPages(pages);
		} catch {
			return;
		}
	}

	return (
		<section className="options_pagesTab">
			<Accordion allowMultiple>
				{pages.map((page) => (
					<PageItem
						key={page.id}
						page={page}
						onUpdatePage={getPagesInfo}
					/>
				))}
			</Accordion>
		</section>
	);
}
