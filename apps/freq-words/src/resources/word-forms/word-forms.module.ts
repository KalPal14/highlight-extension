import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Example } from './entities/example.entity';
import { WordForm } from './entities/word-form.entity';
import { Definition } from './entities/definition.entity';

@Module({
	imports: [TypeOrmModule.forFeature([WordForm, Definition, Example])],
})
export class WordFormsModule {}
