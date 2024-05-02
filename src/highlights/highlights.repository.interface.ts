import { HighlightModel } from '@prisma/client';
import { Highlight } from './highlight.entity';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

export interface IHighlightsRepository {
	create: (highlight: Highlight) => Promise<HighlightModel>;
	update: (
		id: number,
		payload: Omit<UpdateHighlightDto, 'startContainer' | 'endContainer'>,
	) => Promise<HighlightModel>;
	findById: (id: number) => Promise<HighlightModel | null>;
	delete: (id: number) => Promise<HighlightModel>;
}
