import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspacesModule } from '../workspaces/workspaces.module';

import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { Source } from './entities/source.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Source]), WorkspacesModule],
	controllers: [SourcesController],
	providers: [SourcesService],
	exports: [SourcesService],
})
export class SourcesModule {}
