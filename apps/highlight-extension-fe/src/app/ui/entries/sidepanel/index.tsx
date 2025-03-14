import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ActiveTabHighlightsPage } from '~/highlight-extension-fe/pages/active-tab-highlights';

function init(): void {
	const rootContainer = document.createElement('div');
	document.body.appendChild(rootContainer);
	const root = createRoot(rootContainer);
	root.render(
		<ChakraProvider>
			<ActiveTabHighlightsPage />
		</ChakraProvider>
	);
}

init();
