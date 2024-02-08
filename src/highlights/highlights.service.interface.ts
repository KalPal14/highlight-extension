import { HighlightModel } from '@prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

export interface IHighlightsService {
	createHighlight: (
		highlightData: CreateHighlightDto,
		user: IJwtPayload,
	) => Promise<HighlightModel>;
	updateHighlight: (id: number, payload: UpdateHighlightDto) => Promise<HighlightModel | Error>;
	deleteHighlight: (id: number) => Promise<HighlightModel | Error>;
}
