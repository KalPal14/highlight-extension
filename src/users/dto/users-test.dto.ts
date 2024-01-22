import { Matches, IsEmail, IsString } from 'class-validator';

export class UsersTestDto {
	@IsEmail({}, { message: 'Enter a valid email' })
	email: string;

	@Matches(/^[a-zA-Z0-9_-]+$/g, {
		message:
			'The username field can only contain uppercase and lowercase letters, as well as the characters - and _',
	})
	@IsString({ message: 'The username field is required.' })
	username: string;
}
