import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import { LoggerService } from '@/common/services/logger.service';
import TYPES from '@/types.inversify';
import { ILogger } from '@/common/services/logger.interface';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService);
});

function bootstrap(): void {
	const container = new Container();
	container.load(appBindings);

	const app = container.get<App>(TYPES.App);
	app.init();
}

bootstrap();
