import { HighlightModel } from '@prisma/client';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { IHighlight } from './highlight.entity.interface';

export interface IHighlightsRepository {
	create: (highlight: IHighlight) => Promise<HighlightModel>;
	update: (
		id: number,
		payload: Omit<UpdateHighlightDto, 'startContainer' | 'endContainer'>,
	) => Promise<HighlightModel>;
	findById: (id: number) => Promise<HighlightModel | null>;
	delete: (id: number) => Promise<HighlightModel>;
}
