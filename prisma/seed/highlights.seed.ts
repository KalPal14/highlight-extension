import { PrismaClient } from '@prisma/client';

import { HIGHLIGHT_SPEC } from '../../src/common/constants/spec/highlights';

const salt = Number(process.env.SALT);

export async function highlightsSeed(prisma: PrismaClient): Promise<void> {
	const highlight1 = await prisma.highlightModel.upsert({
		where: { id: HIGHLIGHT_SPEC.id },
		update: {},
		create: {
			pageId: HIGHLIGHT_SPEC.pageId,
			text: HIGHLIGHT_SPEC.text,
			color: HIGHLIGHT_SPEC.color,
			note: HIGHLIGHT_SPEC.note,
		},
	});
	const highlight2 = await prisma.highlightModel.upsert({
		where: { id: HIGHLIGHT_SPEC.id + 1 },
		update: {},
		create: {
			pageId: HIGHLIGHT_SPEC.pageId,
			text: 'The fields involved in defining the relation are highlighted:',
			color: '#ff1500',
		},
	});
	console.log({ highlight1, highlight2 });
}
