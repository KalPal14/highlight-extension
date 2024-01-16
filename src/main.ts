import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import { LoggerService } from '@/common/services/logger.service';
import { UsersController } from '@/users/users.controller';
import { ConfigService } from '@/common/services/config.service';
import TYPES from '@/types.inversify';
import { ILogger } from '@/common/services/logger.service.interface';
import { IUsersController } from '@/users/users.controller.interface';
import { IConfigService } from '@/common/services/config.service.interface';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
});

function bootstrap(): void {
	const container = new Container();
	container.load(appBindings);

	const app = container.get<App>(TYPES.App);
	app.init();
}

bootstrap();
