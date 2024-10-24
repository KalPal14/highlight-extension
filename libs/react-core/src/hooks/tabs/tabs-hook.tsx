import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

import { getUrlSearchParam, setUrlSearchParam } from '~libs/client-core';

import { ITab } from './tab';

interface ITabsHookReturn {
	activeTabIndex: number;
	tabList: JSX.Element;
	tabPanels(elements?: JSX.Element[]): JSX.Element;
}

export function useTabs(tabs: ITab[]): ITabsHookReturn {
	const [activeTabIndex, setActiveTabIndex] = useState(0);

	useEffect(() => {
		const tabParam = getUrlSearchParam('tab');
		if (!tabParam) return;

		const tabIndex = tabs.findIndex(({ name }) => name === tabParam);
		if (tabIndex === -1) return;

		setActiveTabIndex(tabIndex);
	}, []);

	const tabList = (
		<TabList>
			{tabs.map(({ label, name }, index) => (
				<Tab
					key={name}
					onClick={() => {
						setUrlSearchParam('tab', name);
						setActiveTabIndex(index);
					}}
				>
					{label}
				</Tab>
			))}
		</TabList>
	);

	function tabPanels(elements?: JSX.Element[]): JSX.Element {
		return (
			<TabPanels>
				{tabs.map(({ element }, index) => (
					<TabPanel key={index}>{element ?? elements?.[index] ?? <></>}</TabPanel>
				))}
			</TabPanels>
		);
	}

	return { activeTabIndex, tabList, tabPanels };
}
