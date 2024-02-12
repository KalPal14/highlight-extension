import { PageModel } from '@prisma/client';
import { Page } from './page.entity';
import { TPageDeepModel } from './page-deep-model.interface';

export interface IPagesRepository {
	create: (page: Page) => Promise<PageModel>;
	findByUrl: (
		url: string,
		userId: number,
		includeHighlights?: boolean,
	) => Promise<TPageDeepModel | null>;
	findAll: (userId: number, includeHighlights?: boolean) => Promise<TPageDeepModel[]>;
}
