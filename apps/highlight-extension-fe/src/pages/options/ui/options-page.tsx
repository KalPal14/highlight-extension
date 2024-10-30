import React from 'react';
import { Alert, AlertIcon, Heading, TabPanels, Tabs } from '@chakra-ui/react';

import './styles.scss';

import { useTabs } from '~libs/react-core';

import { useUsers } from '~/highlight-extension-fe/entities/user';
import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';

import { tabsList } from './tabs-list';

export function OptionsPage(): JSX.Element {
	const { currentUser } = useUsers().data;
	const { currentWorkspace } = useWorkspaces().data;

	const { activeTabIndex, tabList, tabPanels } = useTabs(tabsList);

	return (
		<section className="options">
			<Heading
				as="h1"
				size="2xl"
				mb={5}
			>
				Settings
			</Heading>
			<Tabs index={activeTabIndex}>
				{tabList}
				{currentUser && currentWorkspace && tabPanels()}

				{(!currentUser || !currentWorkspace) && (
					<TabPanels>
						<Alert
							status="warning"
							mt={3}
						>
							<AlertIcon />
							Sorry. We were unable to load your information. Make sure you are logged in.
						</Alert>
					</TabPanels>
				)}
			</Tabs>
		</section>
	);
}
