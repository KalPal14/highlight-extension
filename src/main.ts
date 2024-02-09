import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import { LoggerService } from '@/common/services/logger.service';
import { UsersController } from '@/users/users.controller';
import { ConfigService } from '@/common/services/config.service';
import { ExceptionFilter } from '@/errors/exception.filter';
import { PrismaService } from '@/common/services/prisma.service';
import { UsersRepository } from '@/users/users.repository';
import { UsersService } from '@/users/users.service';
import TYPES from '@/types.inversify';
import { ILogger } from '@/common/services/logger.service.interface';
import { IUsersController } from '@/users/users.controller.interface';
import { IConfigService } from '@/common/services/config.service.interface';
import { IExceptionFilter } from '@/errors/exception.filter.interface';
import { IPrismaService } from '@/common/services/prisma.service.interface';
import { IUsersRepository } from '@/users/users.repository.interface';
import { IUsersService } from '@/users/users.service.interface';
import { IPagesRepository } from '@/pages/pages.repository.interface';
import { PagesRepository } from '@/pages/pages.repository';
import { IPagesServise } from '@/pages/pages.service.interface';
import { PagesServise } from '@/pages/pages.service';
import { IHighlightsController } from '@/highlights/highlights.controller.interface';
import { HighlightsController } from '@/highlights/highlights.controller';
import { HighlightsRepository } from '@/highlights/highlights.repository';
import { IHighlightsRepository } from '@/highlights/highlights.repository.interface';
import { HighlightsService } from '@/highlights/highlights.service';
import { IHighlightsService } from '@/highlights/highlights.service.interface';
import { IPagesController } from '@/pages/pagea.controller.interface';
import { PagesController } from '@/pages/pages.controller';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
});

const userBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository);
	bind<IUsersService>(TYPES.UsersService).to(UsersService);
});

const pageBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IPagesRepository>(TYPES.PagesRepository).to(PagesRepository);
	bind<IPagesServise>(TYPES.PagesServise).to(PagesServise);
	bind<IPagesController>(TYPES.PagesController).to(PagesController);
});

const highlightBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IHighlightsController>(TYPES.HighlightsController).to(HighlightsController);
	bind<IHighlightsRepository>(TYPES.HighlightsRepository).to(HighlightsRepository);
	bind<IHighlightsService>(TYPES.HighlightsService).to(HighlightsService);
});

export async function bootstrap(port?: number): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(userBindings);
	container.load(pageBindings);
	container.load(highlightBindings);

	const app = container.get<App>(TYPES.App);
	await app.init(port);

	return app;
}

if (!process.env.IS_RUN_E2E) {
	bootstrap();
}
