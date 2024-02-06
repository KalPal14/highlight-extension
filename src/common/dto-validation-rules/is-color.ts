import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	isHexColor,
	isRgbColor,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsColor implements ValidatorConstraintInterface {
	validate(fieldValue: string): boolean {
		return isRgbColor(fieldValue) || isHexColor(fieldValue);
	}
}
