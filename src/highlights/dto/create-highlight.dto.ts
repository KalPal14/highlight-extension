import { IsColor } from '@/common/dto-validation-rules/is-color';
import { IsString, IsUrl, Validate } from 'class-validator';

export class CreateHighlightDto {
	@IsUrl({}, { message: 'The pageUrl field must contain a valid link to the page' })
	pageUrl: string;

	@IsString({ message: 'The text field is required' })
	text: string;

	note?: string;

	@Validate(IsColor, { message: 'The color field must contain a valid RGB or HEX color' })
	color: string;
}
