import { PageModel } from '@prisma/client';
import { CreateHighlightDto } from '@/highlights/dto/create-highlight.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { GetPageDto } from './dto/get-page.dto';

export interface IPagesServise {
	createPage: (pageData: CreateHighlightDto, userData: IJwtPayload) => Promise<PageModel | Error>;
	getPageInfo: (pageData: GetPageDto, userData: IJwtPayload) => Promise<PageModel | null>;
}
