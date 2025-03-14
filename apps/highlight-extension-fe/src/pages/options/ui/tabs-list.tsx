import React from 'react';

import { ITab } from '~libs/react-core';

import { UserInfoTab } from './user-info-tab';
import { ColorsTab } from './colors-tab';

export const tabsList: ITab[] = [
	{
		label: 'User info',
		name: 'user-info',
		element: <UserInfoTab />,
	},
	{
		label: 'Colors',
		name: 'colors',
		element: <ColorsTab />,
	},
];
