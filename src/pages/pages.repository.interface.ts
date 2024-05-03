import { PageModel } from '@prisma/client';

import { TPageDeepModel } from './page-deep-model.type';
import { IPage } from './page.entity.interface';

export interface IPagesRepository {
	create: (page: IPage) => Promise<PageModel>;
	findByUrl: (
		url: string,
		userId: number,
		includeHighlights?: boolean,
	) => Promise<TPageDeepModel | null>;
	findAll: (userId: number, includeHighlights?: boolean) => Promise<TPageDeepModel[]>;
}
