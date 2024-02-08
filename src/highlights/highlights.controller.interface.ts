import { Router } from 'express';

import { TController } from '@/common/types/controller.type';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

export interface IHighlightsController {
	router: Router;

	createHighlight: TController<{}, {}, CreateHighlightDto>;
	updateHighlight: TController<{ id: string }, {}, UpdateHighlightDto>;
	deleteHighlight: TController<{ id: string }>;
}
