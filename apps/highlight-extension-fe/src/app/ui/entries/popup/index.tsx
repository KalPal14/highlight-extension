import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ExtensionControlPage } from '~/highlight-extension-fe/pages/extension-control';

function init(): void {
	const rootContainer = document.createElement('div');
	document.body.appendChild(rootContainer);
	const root = createRoot(rootContainer);
	root.render(
		<ChakraProvider>
			<ExtensionControlPage />
		</ChakraProvider>
	);
}

init();
