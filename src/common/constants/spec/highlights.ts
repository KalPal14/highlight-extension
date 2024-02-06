import { HighlightModel } from '@prisma/client';

import { PAGE_SPEC } from './pages';

export const HIGHLIGHT_SPEC = {
	id: 1,
	pageId: PAGE_SPEC.id,
	text: 'one-to-many relation between User and Post',
	color: '#ff1500',
	note: 'those modules between which the connection is established in the example',

	wrongId: 500,
	wrongPageId: PAGE_SPEC.wrongId,
	wrongText: 'wrong!!! wrong!!!',

	invalidColor: 'green',
};

export const RIGHT_HIGHLIGHT_MODEL: HighlightModel = {
	id: HIGHLIGHT_SPEC.id,
	pageId: HIGHLIGHT_SPEC.pageId,
	text: HIGHLIGHT_SPEC.text,
	color: HIGHLIGHT_SPEC.color,
	note: HIGHLIGHT_SPEC.note,
};
