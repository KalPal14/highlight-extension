import { PageModel } from '@prisma/client';
import { CreateHighlightDto } from '@/highlights/dto/create-highlight.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { GetPageDto } from './dto/get-page.dto';

export type TPageInfo = PageModel & {
	highlightsCount: number;
	notesCount: number;
};

export interface IPagesServise {
	createPage: (pageUrl: string, userData: IJwtPayload) => Promise<PageModel | Error>;
	getPageInfo: (url: string, userId: number) => Promise<PageModel | null>;
	getPagesInfo: (userId: number) => Promise<TPageInfo[]>;
}
