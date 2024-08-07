import { PrismaClient } from '@prisma/client';

import { RIGHT_HIGHLIGHT } from '../../src/common/constants/spec/highlights';
import { RIGHT_END_NODE, RIGHT_START_NODE } from '../../src/common/constants/spec/nodes';

const salt = Number(process.env.SALT);

export async function highlightsSeed(prisma: PrismaClient): Promise<void> {
	const highlight1 = await prisma.highlightModel.upsert({
		where: { id: RIGHT_HIGHLIGHT.id },
		update: {},
		create: {
			pageId: RIGHT_HIGHLIGHT.pageId,
			order: RIGHT_HIGHLIGHT.order,
			startContainerId: RIGHT_START_NODE.id,
			endContainerId: RIGHT_END_NODE.id,
			startOffset: RIGHT_HIGHLIGHT.startOffset,
			endOffset: RIGHT_HIGHLIGHT.endOffset,
			text: RIGHT_HIGHLIGHT.text,
			color: RIGHT_HIGHLIGHT.color,
			note: RIGHT_HIGHLIGHT.note,
		},
	});
	console.log({ highlight1 });
}
