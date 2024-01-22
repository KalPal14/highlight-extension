import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

import { IMiddleware } from './middleware.interface';

interface IErrMsg {
	property: string;
	value: string | 'undefined';
	errors: string[];
}

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				const errorsMsg = this.constructErrorsMsg(errors);
				res.status(422).send(errorsMsg);
				return;
			}
			next();
		});
	}

	private constructErrorsMsg(errors: ValidationError[]): IErrMsg[] {
		return errors.map((err) => ({
			property: err.property,
			value: err.value || 'undefined',
			errors: Object.values(err.constraints || {}),
		}));
	}
}
