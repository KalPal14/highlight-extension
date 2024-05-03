import { Router } from 'express';

import { TController } from '@/common/types/controller.type';
import { GetPageDto } from './dto/get-page.dto';

export interface IPagesController {
	router: Router;

	getPage: TController<{}, {}, {}, GetPageDto>;
	getPages: TController;
}
