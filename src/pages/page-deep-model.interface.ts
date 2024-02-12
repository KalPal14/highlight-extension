import { PageModel, HighlightModel } from '@prisma/client';

export type TPageDeepModel = PageModel & {
	highlights?: HighlightModel[];
};
