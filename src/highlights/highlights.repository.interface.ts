import { HighlightModel } from '@prisma/client';
import { Highlight } from './highlight.entity';

export interface IHighlightsRepository {
	create: (highlight: Highlight) => Promise<HighlightModel>;
}
