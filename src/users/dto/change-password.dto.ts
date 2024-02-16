import { IsString } from 'class-validator';

export class ChangePasswordDto {
	@IsString({ message: 'Password field is required' })
	password: string;

	@IsString({ message: 'Password field is required' })
	newPassword: string;
}
