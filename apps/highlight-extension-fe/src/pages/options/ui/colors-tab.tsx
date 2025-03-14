import React from 'react';

import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';

import { ChangeColorsForm } from './forms/change-colors-form';

export function ColorsTab(): JSX.Element {
	const { currentWorkspace } = useWorkspaces().data;

	return (
		<section className="options_colorsTab">{currentWorkspace && <ChangeColorsForm />}</section>
	);
}
