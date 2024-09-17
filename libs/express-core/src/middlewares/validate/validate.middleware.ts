import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

import { HttpValidationException, THttpValidationExceptionPayload } from '~libs/common';

import { IMiddleware } from '../common/types/middleware.interface';

import type { ClassConstructor } from 'class-transformer';

export class ValidateMiddleware implements IMiddleware {
	constructor(
		private classToValidate: ClassConstructor<object>,
		private validateMode: 'body' | 'query' = 'body'
	) {}

	use(req: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, req[this.validateMode]);
		validate(instance, {
			skipMissingProperties: false,
			whitelist: true,
			validationError: { target: false },
		}).then((errors) => {
			if (errors.length > 0) {
				const errorsMsg = this.constructErrorsMsg(errors);
				return next(new HttpValidationException(errorsMsg));
			}
			next();
		});
	}

	private constructErrorsMsg(
		errors: ValidationError[],
		parentProperties: string[] = []
	): THttpValidationExceptionPayload {
		return errors
			.map((err) => {
				if (err.children?.length) {
					return this.constructErrorsMsg(err.children, [...parentProperties, err.property]);
				}
				return {
					property: parentProperties.length
						? `${parentProperties.join('.')}.${err.property}`
						: err.property,
					errors: Object.values(err.constraints || {}),
				};
			})
			.flat();
	}
}
