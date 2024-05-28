import { HighlightModel } from '@prisma/client';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { IHighlight } from './highlight.entity.interface';
import { THighlightDeepModel } from './highlight-deep-model.type';

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
