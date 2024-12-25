import { Alert, AlertIcon, Heading, Tabs } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { browserAdapter } from '~libs/client-core';
import { useTabs as useUITabs } from '~libs/react-core';

import { useHighlights } from '~/highlight-extension-fe/entities/highlight';
import { useTabs } from '~/highlight-extension-fe/entities/browser';
import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';

import './styles.scss';

import { highlightsTabs } from './constants/highlights-tabs';

export function HighlightsListTabs(): JSX.Element {
	const { currentWorkspace } = useWorkspaces().data;
	const {
		data: { canUseContentScriptInTab },
		actions: { updateActiveTabInfo, updateActiveTabInfoOnWindowChange },
		selectors: { getActiveTabUrl },
	} = useTabs();
	const {
		actions: { getPageHighlights },
	} = useHighlights();

	const { activeTabIndex, tabList, tabPanels } = useUITabs(highlightsTabs);

	useEffect(() => {
		onTabChange();

		if (!currentWorkspace) return;

		browserAdapter.windows.onFocusChanged.addListener(onWindowFocusChanged);
		browserAdapter.tabs.onActivated.addListener(onTabChange);
		browserAdapter.tabs.onUpdated.addListener(onTabChange);

		return (): void => {
			browserAdapter.windows.onFocusChanged.addListener(onWindowFocusChanged);
			browserAdapter.tabs.onActivated.removeListener(onTabChange);
			browserAdapter.tabs.onUpdated.removeListener(onTabChange);
		};
	}, [currentWorkspace]);

	async function onWindowFocusChanged(windowId: number): Promise<void> {
		await updateActiveTabInfoOnWindowChange(windowId, setHighlightsFields);
	}

	async function onTabChange(): Promise<void> {
		await updateActiveTabInfo(setHighlightsFields);
	}

	async function setHighlightsFields(): Promise<void> {
		const highlights = await getPageHighlights(getActiveTabUrl()).catch(() => []);
		console.log(highlights);
	}

	if (!canUseContentScriptInTab) {
		return (
			<>
				<Heading
					as="h6"
					size="md"
					textAlign="center"
				>
					This list of notes is empty
				</Heading>
				<Alert
					status="warning"
					mt={4}
					mb={4}
				>
					<AlertIcon />
					Notes cannot be left on this page
				</Alert>
			</>
		);
	}

	return (
		<Tabs
			variant="soft-rounded"
			colorScheme="green"
			className="highlightsList_tabs"
			index={activeTabIndex}
		>
			<div className="highlightsList_tabsListContainer">{tabList}</div>
			{tabPanels(highlightsTabs.map(({ name }) => <h1>{getActiveTabUrl()}</h1>))}
		</Tabs>
	);
}
