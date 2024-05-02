import { IsNumber, IsOptional, Validate } from 'class-validator';

import { IsColor } from '@/common/dto-validation-rules/is-color';
import { IsNode } from '@/common/dto-validation-rules/is-node';
import { INode } from '@/nodes/node.entity.interface';

export class UpdateHighlightDto {
	text?: string;
	note?: string;

	@IsOptional()
	@Validate(IsNode, {
		message:
			'This field must contain an object containing one string property "text" and two number properties "indexNumber" and "sameElementsAmount".',
	})
	startContainer?: INode;
	@IsOptional()
	@Validate(IsNode, {
		message:
			'This field must contain an object containing one string property "text" and two number properties "indexNumber" and "sameElementsAmount".',
	})
	endContainer?: INode;

	startOffset?: number;
	endOffset?: number;

	@IsOptional()
	@Validate(IsColor, { message: 'The color field must contain a valid RGB or HEX color' })
	color?: string;
}
