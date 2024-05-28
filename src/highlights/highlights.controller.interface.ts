import { Router } from 'express';

import { GetHighlightsDto } from './dto/get-highlights.dto';
import { TController } from '@/common/types/controller.type';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

export interface IHighlightsController {
	router: Router;

	getHighlights: TController<{}, {}, {}, GetHighlightsDto>;
	createHighlight: TController<{}, {}, CreateHighlightDto>;
	updateHighlight: TController<{ id: string }, {}, UpdateHighlightDto>;
	deleteHighlight: TController<{ id: string }>;
}
