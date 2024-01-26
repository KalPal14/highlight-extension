import { IsString, Validate } from 'class-validator';

import { IsUserIdentifier } from '@/common/dto-validation-rules/is-user-identifier';

export class UsersLoginDto {
	@Validate(IsUserIdentifier, {
		message: 'The userIdentifier field must contain a valid email or username',
	})
	userIdentifier: string;

	@IsString({ message: 'Password field is required' })
	password: string;
}
