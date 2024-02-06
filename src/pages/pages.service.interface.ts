import { PageModel } from '@prisma/client';
import { CreateHighlightDto } from '@/highlights/dto/create-highlight.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';

export interface IPagesServise {
	createPage: (pageData: CreateHighlightDto, userData: IJwtPayload) => Promise<PageModel | Error>;
}
