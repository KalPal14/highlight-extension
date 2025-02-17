import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';

import { GetOrCreateSourceDto, GetSourcesDto, UpdateSourceDto } from '~libs/dto/freq-words';
import { SOURCES_BASE_ROUTE, SOURCES_ENDPOINTS } from '~libs/routes/freq-words';
import {
	IDeleteSourceRo,
	IGetOrCreateSourceRo,
	IGetSourceRo,
	IUpdateSourceRo,
	TGetSourcesRo,
} from '~libs/ro/freq-words';

import { SourcesService } from './sources.service';

@Controller(SOURCES_BASE_ROUTE)
export class SourcesController {
	constructor(private readonly sourcesService: SourcesService) {}

	@HttpCode(HttpStatus.OK)
	@Post(SOURCES_ENDPOINTS.getOrCreate)
	getOrCreate(@Body() dto: GetOrCreateSourceDto): Promise<IGetOrCreateSourceRo> {
		return this.sourcesService.getOrCreate(dto);
	}

	@Get(SOURCES_ENDPOINTS.getMany)
	getMany(@Query() dto: GetSourcesDto): Promise<TGetSourcesRo> {
		return this.sourcesService.getMany(dto);
	}

	@Get(SOURCES_ENDPOINTS.get)
	getOne(@Param('id') id: string): Promise<IGetSourceRo> {
		return this.sourcesService.getOne(+id);
	}

	@Patch(SOURCES_ENDPOINTS.update)
	update(@Param('id') id: string, @Body() dto: UpdateSourceDto): Promise<IUpdateSourceRo> {
		return this.sourcesService.update(+id, dto);
	}

	@Delete(SOURCES_ENDPOINTS.delete)
	delete(@Param('id') id: string): Promise<IDeleteSourceRo> {
		return this.sourcesService.delete(+id);
	}
}
