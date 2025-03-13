import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { LoginPage } from '~/highlight-extension-fe/pages/login';
import { RegistrationPage } from '~/highlight-extension-fe/pages/registration';
import { TABS_ROUTES } from '~/highlight-extension-fe/shared/ui';

export function TabsRouter(): JSX.Element {
	return (
		<Routes>
			<Route
				path={TABS_ROUTES.login}
				element={<LoginPage />}
			/>
			<Route
				path={TABS_ROUTES.registration}
				element={<RegistrationPage />}
			/>
		</Routes>
	);
}
