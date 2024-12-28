import { Alert, AlertIcon, Heading, Tabs } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { browserAdapter } from '~libs/client-core';
import { IBaseHighlightRo } from '~libs/ro/highlight-extension';
import { useTabs as useUITabs } from '~libs/react-core';

import { useHighlights, THighlightStatus } from '~/highlight-extension-fe/entities/highlight';
import { useTabs } from '~/highlight-extension-fe/entities/browser';
import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';

import './styles.scss';

import { IChangeHighlightForm } from './types/change-highlight-form.interface';
import { highlightsTabs } from './constants/highlights-tabs';
import { HighlightsList } from './highlights-list';

export function HighlightsListTabs(): JSX.Element {
	const { currentWorkspace } = useWorkspaces().data;
	const {
		data: { canUseContentScriptInTab },
		actions: { updateActiveTabInfo, updateActiveTabInfoOnWindowChange },
		selectors: { getActiveTabUrl },
	} = useTabs();
	const {
		actions: { getPageHighlights },
		selectors: { selectHighlightsByStatus },
	} = useHighlights();

	const { activeTabIndex, tabList, tabPanels } = useUITabs(highlightsTabs);

	const formControls = useForm<IChangeHighlightForm>({
		values: {
			highlights: [],
		},
	});
	const { control, setValue } = formControls;
	const highlightsFieldControls = useFieldArray({
		control,
		name: 'highlights',
	});
	const { fields } = highlightsFieldControls;

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
		setValue(
			'highlights',
			highlights.map((highlight) => ({ highlight }))
		);
	}

	const filterHighlightsByTab = (status: THighlightStatus): IBaseHighlightRo[] =>
		selectHighlightsByStatus(
			status,
			getActiveTabUrl(),
			fields.map(({ highlight }) => highlight)
		);

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

	if (!filterHighlightsByTab('unfound').length) {
		return (
			<HighlightsList
				formControls={formControls}
				highlightsFieldControls={highlightsFieldControls}
				activeTabUrl={getActiveTabUrl()}
			/>
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
			{tabPanels(
				highlightsTabs.map(({ name }) => (
					<HighlightsList
						key={name}
						formControls={formControls}
						highlightsFieldControls={highlightsFieldControls}
						highlights={filterHighlightsByTab(name)}
						activeTabUrl={getActiveTabUrl()}
					/>
				))
			)}
		</Tabs>
	);
}
