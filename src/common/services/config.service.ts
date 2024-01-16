import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

import { IConfigService } from './config.service.interface';
import TYPES from '@/types.inversify';
import { ILogger } from './logger.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	env: DotenvParseOutput;

	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error || !result.parsed) {
			this.loggerService.err('[ConfigService] Failed to parse .env file. It may be missing.');
		} else {
			this.loggerService.log('[ConfigService] .env file parsed successfully');
			this.env = result.parsed;
		}
	}

	get(key: string): string | Error {
		if (this.env[key]) {
			return this.env[key];
		}
		this.loggerService.err(`[ConfigService] There is no variable with the key ${key} in .env`);
		return new Error(`.env does not have the value you are trying to get`);
	}
}
