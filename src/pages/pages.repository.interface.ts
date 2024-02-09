import { HighlightModel, PageModel } from '@prisma/client';
import { Page } from './page.entity';

export type TDeepPageModel = PageModel & {
	highlights: HighlightModel[];
};

export interface IPagesRepository {
	create: (page: Page) => Promise<PageModel>;
	findByUrl: (
		url: string,
		userId: number,
		includeHighlights?: boolean,
	) => Promise<PageModel | null>;
	findAll: (userId: number, includeHighlights?: boolean) => Promise<TDeepPageModel[]>;
}
