import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';

@Entity()
export class Workspace {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	ownerId: number;

	@Column()
	name: string;

	@ManyToOne(() => Language, (language) => language.knownLanguageWorkspaces, { eager: true })
	knownLanguage: Language;

	@ManyToOne(() => Language, (language) => language.targetLanguageWorkspaces, { eager: true })
	targetLanguage: Language;
}
