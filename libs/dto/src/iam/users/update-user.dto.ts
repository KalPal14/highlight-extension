import { Type } from 'class-transformer';
import { IsEmail, IsOptional, Matches, ValidateNested, MinLength } from 'class-validator';

import { USERNAME } from '~libs/common';

class ChangePasswordDto {
	@MinLength(6, { message: 'Password must contain at least 6 characters' })
	currentPassword: string;

	@MinLength(6, { message: 'Password must contain at least 6 characters' })
	newPassword: string;
}

export class UpdateUserDto {
	@IsOptional()
	@Matches(USERNAME, {
		message:
			'Username can only contain uppercase and lowercase letters, as well as the characters - and _',
	})
	username?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => ChangePasswordDto)
	password?: ChangePasswordDto;
}
