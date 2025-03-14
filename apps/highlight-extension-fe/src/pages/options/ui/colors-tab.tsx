import React from 'react';

import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';

export function ColorsTab(): JSX.Element {
	const { currentWorkspace } = useWorkspaces().data;

	return (
		<section className="options_colorsTab">{currentWorkspace && <h1>Colors form</h1>}</section>
	);
}
