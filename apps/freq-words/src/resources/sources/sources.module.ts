import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Source } from './entities/source.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Source])],
})
export class SourcesModule {}
