import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import { LoggerService } from '@/services/logger.service';
import { UsersController } from '@/users/users.controller';
import { ConfigService } from '@/services/config.service';
import { ExceptionFilter } from '@/errors/exception.filter';
import { PrismaService } from '@/services/prisma.service';
import { UsersRepository } from '@/users/users.repository';
import { UsersService } from '@/users/users.service';
import TYPES from '@/types.inversify';
import { ILogger } from '@/services/logger.service.interface';
import { IUsersController } from '@/users/users.controller.interface';
import { IConfigService } from '@/services/config.service.interface';
import { IExceptionFilter } from '@/errors/exception.filter.interface';
import { IPrismaService } from '@/services/prisma.service.interface';
import { IUsersRepository } from '@/users/users.repository.interface';
import { IUsersService } from '@/users/users.service.interface';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository);
	bind<IUsersService>(TYPES.UsersService).to(UsersService);
});

async function bootstrap(): Promise<void> {
	const container = new Container();
	container.load(appBindings);

	const app = container.get<App>(TYPES.App);
	await app.init();
}

bootstrap();
