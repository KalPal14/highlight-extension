import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

import './styles.scss';

import { CogSVG } from '~libs/react-core';
import { openTab } from '~libs/client-core';

import { LinkToLogin } from '~/highlight-extension-fe/widgets/link-to-login';
import { useUsers } from '~/highlight-extension-fe/entities/user';
import { useSidePanel } from '~/highlight-extension-fe/entities/browser';
import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

export function ExtensionControlPage(): JSX.Element {
	const [jwt] = useCrossBrowserState('jwt');

	const { openSidePanel } = useSidePanel().actions;
	const { logout } = useUsers().actions;

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
				{!jwt && <LinkToLogin />}
				{jwt && (
					<Button
						onClick={logout}
						colorScheme="teal"
					>
						Log out
					</Button>
				)}
			</main>
		</div>
	);
}
