import { IsEmail, Matches, IsString } from 'class-validator';

import { USERNAME } from '@/common/constants/regexp';

export class UsersRegisterDto {
	@IsEmail({}, { message: 'Enter a valid email' })
	email: string;

	@Matches(USERNAME, {
		message:
			'The username field can only contain uppercase and lowercase letters, as well as the characters - and _',
	})
	@IsString({ message: 'The username field is required.' })
	username: string;

	@IsString({ message: 'Password field is required' })
	password: string;
}
