import { DeepPartial } from 'typeorm';

import {
	DEFINITION_LEMMA_ENGLISH_ENTITY,
	DEFINITION_LEMMA_URKAINIAN_ENTITY,
	DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	DEFINITION_WORD_FORM_URKAINIAN_ENTITY,
} from '../../word-forms/stubs/definitions';
import { Example } from '../entities/example.entity';

export const EXAMPLES_URKAINIAN_LEMMA_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 1,
		phrase: 'Програмування - це складний процес, який вимагає великої уваги до деталей.',
		definition: DEFINITION_LEMMA_URKAINIAN_ENTITY,
	},
];

export const EXAMPLES_ENGLISH_LEMMA_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 2,
		phrase: 'Programming is a complex process that requires great attention to detail.',
		definition: DEFINITION_LEMMA_ENGLISH_ENTITY,
	},
];

export const EXAMPLES_URKAINIAN_WORD_FORM_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 3,
		phrase: 'Він займається програмуванням вже понад 10 років.',
		definition: DEFINITION_WORD_FORM_URKAINIAN_ENTITY,
	},
];

export const EXAMPLES_ENGLISH_WORD_FORM_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 4,
		phrase: 'He has been involved in programming for over 10 years.',
		definition: DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	},
];
