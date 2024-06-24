import { HighlightModel } from '@prisma/client';

import { THighlightDeepModel } from './types/highlight-deep-model.type';

import { UpdateHighlightDto } from '@/dto/highlights/update-highlight.dto';
import { IHighlight } from '@/entities/highlight-entity/highlight.entity.interface';

export interface IHighlightsRepository {
	create: (highlight: IHighlight) => Promise<THighlightDeepModel>;
	update: (
		id: number,
		payload: Omit<UpdateHighlightDto, 'startContainer' | 'endContainer'>,
	) => Promise<THighlightDeepModel>;
	findById: (id: number) => Promise<THighlightDeepModel | null>;
	findAllByIds: (isd: number[]) => Promise<THighlightDeepModel[]>;
	findAllByPageUrl: (pageId: number) => Promise<THighlightDeepModel[] | null>;
	delete: (id: number) => Promise<HighlightModel>;
}
