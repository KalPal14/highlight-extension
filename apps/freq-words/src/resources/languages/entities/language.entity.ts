import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Workspace } from '~/freq-words/resources/workspaces/entities/workspace.entity';

@Entity()
export class Language {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@OneToMany(() => Workspace, (workspace) => workspace.knownLanguage)
	knownLanguageWorkspaces: Workspace[];

	@OneToMany(() => Workspace, (workspace) => workspace.targetLanguage)
	targetLanguageWorkspaces: Workspace[];
}
