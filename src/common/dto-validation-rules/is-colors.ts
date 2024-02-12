import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { isColor } from './is-color';

@ValidatorConstraint({ async: false })
export class IsColors implements ValidatorConstraintInterface {
	validate(fieldValue: string[]): boolean {
		return !fieldValue.map((item) => isColor(item)).includes(false);
	}
}
