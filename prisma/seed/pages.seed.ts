import { PrismaClient } from '@prisma/client';

import { PAGE_SPEC } from '../../src/common/constants/spec/pages';

const salt = Number(process.env.SALT);

export async function pagesSeed(prisma: PrismaClient): Promise<void> {
	const page1 = await prisma.pageModel.upsert({
		where: { id: PAGE_SPEC.id },
		update: {},
		create: {
			userId: PAGE_SPEC.userId,
			url: PAGE_SPEC.url,
		},
	});
	const page2 = await prisma.pageModel.upsert({
		where: { id: PAGE_SPEC.id + 1 },
		update: {},
		create: {
			userId: PAGE_SPEC.userId,
			url: 'https://uk.wikipedia.org/wiki/%D0%9A%D0%B2%D0%B5%D0%BD%D1%82%D1%96%D0%BD_%D0%A2%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D1%96%D0%BD%D0%BE',
		},
	});
	console.log({ page1, page2 });
}
