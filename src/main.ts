import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import { LoggerService } from '@/services/logger.service';
import { UsersController } from '@/users/users.controller';
import { ConfigService } from '@/services/config.service';
import { ExceptionFilter } from '@/errors/exception.filter';
import TYPES from '@/types.inversify';
import { ILogger } from '@/services/logger.service.interface';
import { IUsersController } from '@/users/users.controller.interface';
import { IConfigService } from '@/services/config.service.interface';
import { IExceptionFilter } from '@/errors/exception.filter.interface';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
});

function bootstrap(): void {
	const container = new Container();
	container.load(appBindings);

	const app = container.get<App>(TYPES.App);
	app.init();
}

bootstrap();
