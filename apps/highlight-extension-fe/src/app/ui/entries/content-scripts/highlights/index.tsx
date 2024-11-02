import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactShadowRoot from 'react-shadow-root';

import { HighlighterPage } from '~/highlight-extension-fe/pages/highlighter';

init();

function init(): void {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
		return;
	}

	const highlightsMarker = document.createElement('highlights-ext-container');
	highlightsMarker.id = 'highlights-ext-container';
	document.body.append(highlightsMarker);

	createRoot(highlightsMarker).render(
		<ReactShadowRoot>
			<HighlighterPage />
		</ReactShadowRoot>
	);
}
