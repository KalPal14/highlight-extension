import { DeepPartial } from 'typeorm';

import { WordForm } from '../entities/word-form.entity';
import {
	ENGLISH_LANGUAGE_ENTITY,
	URKAINIAN_LANGUAGE_ENTITY,
} from '../../languages/stubs/languages';

export const LEMMA_ENTITY: DeepPartial<WordForm> = {
	id: 1,
	name: 'програмування',
	language: URKAINIAN_LANGUAGE_ENTITY,
};

export const WORD_FORM_ENTITY: DeepPartial<WordForm> = {
	id: 2,
	name: 'програмуванням',
	language: URKAINIAN_LANGUAGE_ENTITY,
};

export const SYNONYMS_ENTITIES: DeepPartial<WordForm>[] = [
	{
		id: 3,
		name: 'розробка програм',
		language: URKAINIAN_LANGUAGE_ENTITY,
	},
	{
		id: 4,
		name: 'кодування',
		language: URKAINIAN_LANGUAGE_ENTITY,
	},
	{
		id: 5,
		name: 'розроблення програмного забезпечення',
		language: URKAINIAN_LANGUAGE_ENTITY,
	},
];

export const TRANSLATIONS_ENTITIES: DeepPartial<WordForm>[] = [
	{
		id: 6,
		name: 'programming',
		language: ENGLISH_LANGUAGE_ENTITY,
	},
	{
		id: 7,
		name: 'software development',
		language: ENGLISH_LANGUAGE_ENTITY,
	},
	{
		id: 8,
		name: 'coding',
		language: ENGLISH_LANGUAGE_ENTITY,
	},
];
