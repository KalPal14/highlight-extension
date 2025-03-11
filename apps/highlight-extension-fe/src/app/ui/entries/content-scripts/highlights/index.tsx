import React from 'react';
import { createRoot } from 'react-dom/client';

init();

function init(): void {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
		return;
	}

	const highlightsMarker = document.createElement('highlights-ext-container');
	highlightsMarker.id = 'highlights-ext-container';
	document.body.append(highlightsMarker);

	createRoot(highlightsMarker).render(<h1>Highlights</h1>);
}
