import '~libs/express-core/config';

import 'reflect-metadata';
import { Container } from 'inversify';

import { expressCoreBindings } from '~libs/express-core';

import { TYPES } from '~/iam/common/constants/types';
import App from '~/iam/app';

import { appBindings } from './utils/bindings/app.bindings';
import { userBindings } from './utils/bindings/user.bindings';

export async function bootstrap(): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(expressCoreBindings);
	container.load(userBindings);

	const app = container.get<App>(TYPES.App);
	await app.init();

	return app;
}

bootstrap();
