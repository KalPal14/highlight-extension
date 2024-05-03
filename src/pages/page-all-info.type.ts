import { THighlightDeepModel } from '@/highlights/highlight-deep-model.type';
import { PageModel } from '@prisma/client';

export type TPageAllInfo = PageModel & {
	highlights: THighlightDeepModel[] | null;
};
