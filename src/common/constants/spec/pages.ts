import { PageModel } from '@prisma/client';

import { USER_SPEC } from './users';

export const PAGE_SPEC = {
	id: 1,
	userId: USER_SPEC.id,
	url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations',

	wrongId: 500,
	wrongUserId: USER_SPEC.wrongId,
	wrongUrl: 'https://www.prisma.io/wrong-page',

	invalidUrl: 'https:/www.prisma.io/wrong-page',
};

export const RIGHT_PAGE_MODEL: PageModel = {
	id: PAGE_SPEC.id,
	userId: PAGE_SPEC.userId,
	url: PAGE_SPEC.url,
};
