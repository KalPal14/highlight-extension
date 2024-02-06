import { PageModel } from '@prisma/client';
import { Page } from './page.entity';

export interface IPagesRepository {
	create: (page: Page) => Promise<PageModel>;
	findByUrl: (url: string, userId: number) => Promise<PageModel | null>;
}
