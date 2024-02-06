import { Request, Response, NextFunction, Router } from 'express';

import { HighlightModel } from '@prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';

export interface IHighlightsController {
	router: Router;

	createHighlight: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
