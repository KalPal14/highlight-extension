import { randomUUID } from 'crypto';

import { DeepPartial } from 'typeorm';

import { CreateWorkspaceDto } from '~libs/dto/freq-words';

import { Workspace } from '../entities/workspace.entity';
import {
	ENGLISH_LANGUAGE_ENTITY,
	URKAINIAN_LANGUAGE_ENTITY,
} from '../../languages/stubs/languages';

export const WORKSPACE_ENTITY: DeepPartial<Workspace> = {
	id: 1,
	ownerId: 1,
	name: 'Ukrainian - English',
	knownLanguage: ENGLISH_LANGUAGE_ENTITY,
	targetLanguage: URKAINIAN_LANGUAGE_ENTITY,
};

export const CREATE_WORKSPACE_DTO = (existing?: boolean): CreateWorkspaceDto => ({
	knownLanguageId: ENGLISH_LANGUAGE_ENTITY.id,
	targetLanguageId: URKAINIAN_LANGUAGE_ENTITY.id,
	name: existing ? WORKSPACE_ENTITY.name : `${WORKSPACE_ENTITY.name} ${randomUUID()}`,
});
