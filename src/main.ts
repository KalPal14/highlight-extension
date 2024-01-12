import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import TYPES from '@/types.inversify';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
});

function bootstrap(): void {
	const container = new Container();
	container.load(appBindings);

	const app = container.get<App>(TYPES.App);
	app.init();
}

bootstrap();
