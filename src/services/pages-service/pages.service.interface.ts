import { PageModel } from '@prisma/client';

import { TPageShortInfo } from './types/page-short-info.type';
import { TPageAllInfo } from './types/page-all-info.type';

import { IJwtPayload } from '@/common/types/jwt-payload.interface';

export interface IPagesServise {
	createPage: (pageUrl: string, userData: IJwtPayload) => Promise<PageModel | Error>;
	getPageInfo: (url: string, userId: number) => Promise<TPageAllInfo | null>;
	getPagesInfo: (userId: number) => Promise<TPageShortInfo[]>;
}
