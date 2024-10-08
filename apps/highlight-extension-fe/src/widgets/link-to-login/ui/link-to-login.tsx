import React from 'react';
import { Button, Text } from '@chakra-ui/react';

import { openTab } from '~libs/client-core';

import { FULL_TABS_ROUTES } from '~/highlight-extension-fe/shared/ui';

export function LinkToLogin(): JSX.Element {
	return (
		<section>
			<Button
				onClick={() => openTab(FULL_TABS_ROUTES.login)}
				colorScheme="teal"
				w="100%"
			>
				Log in
			</Button>
			<Text
				mt={1}
				mb={0}
			>
				Don't have an account?{' '}
				<Text
					onClick={() => openTab(FULL_TABS_ROUTES.registration)}
					color="teal.500"
					as="u"
					cursor="pointer"
					mb={0}
				>
					Please register
				</Text>
			</Text>
		</section>
	);
}
