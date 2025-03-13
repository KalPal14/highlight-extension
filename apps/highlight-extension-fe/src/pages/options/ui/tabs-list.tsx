import React from 'react';

import { ITab } from '~libs/react-core';

import { UserInfoTab } from './user-info-tab';

export const tabsList: ITab[] = [
	{
		label: 'User info',
		name: 'user-info',
		element: <UserInfoTab />,
	},
];
