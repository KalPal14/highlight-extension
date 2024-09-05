import React from 'react';
import { createRoot } from 'react-dom/client';

function init(): void {
	const rootContainer = document.createElement('div');
	document.body.appendChild(rootContainer);
	const root = createRoot(rootContainer);
	root.render(<h1>Tabs</h1>);
}

init();
