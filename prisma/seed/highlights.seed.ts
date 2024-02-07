import { PrismaClient } from '@prisma/client';

import { RIGHT_HIGHLIGHT } from '../../src/common/constants/spec/highlights';

const salt = Number(process.env.SALT);

export async function highlightsSeed(prisma: PrismaClient): Promise<void> {
	const highlight1 = await prisma.highlightModel.upsert({
		where: { id: RIGHT_HIGHLIGHT.id },
		update: {},
		create: {
			pageId: RIGHT_HIGHLIGHT.pageId,
			text: RIGHT_HIGHLIGHT.text,
			color: RIGHT_HIGHLIGHT.color,
			note: RIGHT_HIGHLIGHT.note,
		},
	});
	const highlight2 = await prisma.highlightModel.upsert({
		where: { id: RIGHT_HIGHLIGHT.id + 1 },
		update: {},
		create: {
			pageId: RIGHT_HIGHLIGHT.pageId,
			text: 'The fields involved in defining the relation are highlighted:',
			color: '#ff1500',
		},
	});
	console.log({ highlight1, highlight2 });
}
