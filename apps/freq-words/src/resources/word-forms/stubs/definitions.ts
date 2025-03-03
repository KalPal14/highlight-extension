import { DeepPartial } from 'typeorm';

import {
	ENGLISH_LANGUAGE_ENTITY,
	URKAINIAN_LANGUAGE_ENTITY,
} from '../../languages/stubs/languages';
import { Definition } from '../entities/definition.entity';

import {
	LEMMA_ENTITY,
	SYNONYMS_ENTITIES,
	TRANSLATIONS_ENTITIES,
	WORD_FORM_ENTITY,
} from './word-forms';

export const DEFINITION_LEMMA_URKAINIAN_ENTITY: DeepPartial<Definition> = {
	id: 1,
	description: `Процес проектування, написання, тестування та підтримки комп'ютерних програм`,
	language: URKAINIAN_LANGUAGE_ENTITY,
	wordForm: LEMMA_ENTITY,
	synonyms: SYNONYMS_ENTITIES,
};

export const DEFINITION_LEMMA_ENGLISH_ENTITY: DeepPartial<Definition> = {
	id: 2,
	description:
		'The process of designing, writing, testing, and maintaining the source code of computer programs',
	language: ENGLISH_LANGUAGE_ENTITY,
	wordForm: LEMMA_ENTITY,
	synonyms: TRANSLATIONS_ENTITIES,
};

export const DEFINITION_WORD_FORM_URKAINIAN_ENTITY: DeepPartial<Definition> = {
	id: 3,
	description: `Процес проектування, написання, тестування та підтримки комп'ютерних програм`,
	language: URKAINIAN_LANGUAGE_ENTITY,
	wordForm: WORD_FORM_ENTITY,
	synonyms: SYNONYMS_ENTITIES,
};

export const DEFINITION_WORD_FORM_ENGLISH_ENTITY: DeepPartial<Definition> = {
	id: 4,
	description:
		'The process of designing, writing, testing, and maintaining the source code of computer programs',
	language: ENGLISH_LANGUAGE_ENTITY,
	wordForm: WORD_FORM_ENTITY,
	synonyms: TRANSLATIONS_ENTITIES,
};
