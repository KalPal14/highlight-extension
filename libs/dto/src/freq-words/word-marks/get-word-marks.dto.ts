import { IsNumber } from 'class-validator';

export class GetWordMarksDto {
	@IsNumber()
	workspaceId: number;
}
