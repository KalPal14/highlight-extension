import { Router } from 'express';

import { TController } from '../common/types/controller.type';

import { CreateHighlightDto } from '@/dto/highlights/create-highlight.dto';
import { GetHighlightsDto } from '@/dto/highlights/get-highlights.dto';
import { UpdateHighlightDto } from '@/dto/highlights/update-highlight.dto';

export interface IHighlightsController {
	router: Router;

	getHighlights: TController<{}, {}, {}, GetHighlightsDto>;
	createHighlight: TController<{}, {}, CreateHighlightDto>;
	updateHighlight: TController<{ id: string }, {}, UpdateHighlightDto>;
	deleteHighlight: TController<{ id: string }>;
}
