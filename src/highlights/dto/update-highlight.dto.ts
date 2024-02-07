import { IsColor } from '@/common/dto-validation-rules/is-color';
import { IsOptional, Validate } from 'class-validator';

export class UpdateHighlightDto {
	text?: string;
	note?: string;

	@IsOptional()
	@Validate(IsColor, { message: 'The color field must contain a valid RGB or HEX color' })
	color?: string;
}
