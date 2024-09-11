import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

import './styles.scss';

import { CogSVG } from '~libs/react-core';
import { openTab } from '~libs/client-core';

import { LinkToLogin } from '~/highlight-extension-fe/widgets/link-to-login';
import { useSidePanel } from '~/highlight-extension-fe/entities/browser';

export function ExtensionControlPage(): JSX.Element {
	const { openSidePanel } = useSidePanel().actions;

	return (
		<div className="extensionControlPage">
			<header className="extensionControlPage_header">
				<Tooltip
					label="Settings"
					fontSize="md"
					placement="auto-end"
				>
					<div>
						<CogSVG
							onClick={() => openTab('options.html')}
							height={28}
							width={28}
							cursor="pointer"
						/>
					</div>
				</Tooltip>
			</header>
			<main>
				<Button
					onClick={openSidePanel}
					colorScheme="red"
				>
					Open sidebar
				</Button>
				<LinkToLogin />
			</main>
		</div>
	);
}
