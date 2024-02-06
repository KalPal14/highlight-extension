import { HighlightModel } from '@prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';

export interface IHighlightsService {
	createHighlight: (
		highlightData: CreateHighlightDto,
		user: IJwtPayload,
	) => Promise<HighlightModel>;
}
