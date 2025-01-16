import { HttpException, HttpStatus } from '@nestjs/common';

import { THttpValidationExceptionPayload } from '~libs/common';

export class ValidationException extends HttpException {
	name = 'ValidationException';

	constructor(validationErrors: THttpValidationExceptionPayload) {
		super({ err: validationErrors }, HttpStatus.BAD_REQUEST);
	}
}
