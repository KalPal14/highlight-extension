import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WordFormMark } from './entities/word-form-mark.entity';
import { WordMark } from './entities/word-mark.entity';

@Module({
	imports: [TypeOrmModule.forFeature([WordMark, WordFormMark])],
})
export class WordMarksModule {}
