import React from 'react';
import { Alert, AlertIcon, Tooltip } from '@chakra-ui/react';

import { CogSVG } from '~libs/react-core';
import { openTab } from '~libs/client-core';

import { FULL_OPTIONS_ROUTES } from '~/highlight-extension-fe/shared/ui';
import { LinkToLogin } from '~/highlight-extension-fe/widgets/link-to-login';
import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

import { HighlightsListTabs } from './highlights-list-tabs';

export function ActiveTabHighlightsPage(): JSX.Element {
	const [jwt] = useCrossBrowserState('jwt');

	return (
		<div className="activeTabHighlightsPage">
			<header className="activeTabHighlightsPage_header">
				<Tooltip
					label="Settings"
					fontSize="md"
					placement="left"
				>
					<div>
						<CogSVG
							onClick={() => openTab(FULL_OPTIONS_ROUTES.pages)}
							height={28}
							width={28}
							cursor="pointer"
						/>
					</div>
				</Tooltip>
			</header>
			<main className="highlightsList">
				{!jwt && (
					<>
						<Alert
							status="info"
							mt={4}
							mb={4}
						>
							<AlertIcon />
							All the notes you have on the active page will appear here. Please log in to continue
						</Alert>
						<LinkToLogin />
					</>
				)}
				{Boolean(jwt) && <HighlightsListTabs />}
			</main>
		</div>
	);
}
