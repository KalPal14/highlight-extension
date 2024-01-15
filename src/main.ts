import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import { LoggerService } from '@/common/services/logger.service';
import { UsersController } from '@/users/users.controller';
import TYPES from '@/types.inversify';
import { ILogger } from '@/common/services/logger.interface';
import { IUsersController } from '@/users/users.controller.interface';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
});

function bootstrap(): void {
	const container = new Container();
	container.load(appBindings);

	const app = container.get<App>(TYPES.App);
	app.init();
}

bootstrap();
