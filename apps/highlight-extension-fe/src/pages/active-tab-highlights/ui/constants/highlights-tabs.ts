import { ITab } from '~libs/react-core';

import { THighlightStatus } from '~/highlight-extension-fe/entities/highlight';

export const highlightsTabs: ITab<THighlightStatus>[] = [
	{
		label: 'All',
		name: 'all',
	},
	{
		label: 'Found',
		name: 'found',
	},
	{
		label: 'Unfound',
		name: 'unfound',
	},
];
