import { IsOptional, Validate } from 'class-validator';

import { IsColors } from '@/common/dto-validation-rules/is-colors';
import { UserModel } from '@prisma/client';

export class UpdateUserDto implements Partial<UserModel> {
	@IsOptional()
	@Validate(IsColors, {
		message: 'The colors field must contain an array of colors in RGB or HEX format',
	})
	colors?: string[];
}
