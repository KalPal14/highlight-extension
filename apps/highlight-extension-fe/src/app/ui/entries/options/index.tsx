import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { OptionsPage } from '~/highlight-extension-fe/pages/options';

function init(): void {
	const rootContainer = document.createElement('div');
	document.body.appendChild(rootContainer);
	const root = createRoot(rootContainer);
	root.render(
		<ChakraProvider>
			<OptionsPage />
		</ChakraProvider>
	);
}

init();
