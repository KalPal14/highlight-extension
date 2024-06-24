import { HighlightModel } from '@prisma/client';

import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { CreateHighlightDto } from '@/dto/highlights/create-highlight.dto';
import { UpdateHighlightDto } from '@/dto/highlights/update-highlight.dto';
import { THighlightDeepModel } from '@/repositories/highlights-repository/types/highlight-deep-model.type';

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
