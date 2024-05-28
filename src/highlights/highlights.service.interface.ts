import { HighlightModel } from '@prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { THighlightDeepModel } from './highlight-deep-model.type';

export interface IHighlightsService {
	getHighlights: (ids: number[]) => Promise<THighlightDeepModel[]>;
	createHighlight: (
		highlightData: CreateHighlightDto,
		user: IJwtPayload,
	) => Promise<THighlightDeepModel>;
	updateHighlight: (
		id: number,
		payload: UpdateHighlightDto,
	) => Promise<THighlightDeepModel | Error>;
	deleteHighlight: (id: number) => Promise<HighlightModel | Error>;
}
