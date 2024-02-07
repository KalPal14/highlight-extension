import { HighlightModel } from '@prisma/client';

import { RIGHT_PAGE, WRONG_PAGE } from './pages';

export const RIGHT_HIGHLIGHT: HighlightModel = {
	id: 1,
	pageId: RIGHT_PAGE.id,
	text: 'one-to-many relation between User and Post',
	color: '#ff1500',
	note: 'those modules between which the connection is established in the example',
};

export const WRONG_HIGHLIGHT: Partial<HighlightModel> = {
	id: 500,
	pageId: WRONG_PAGE.id,
	text: 'wrong!!! wrong!!!',
};

export const INVALID_HIGHLIGHT: Partial<HighlightModel> = {
	color: 'green',
};
