import React from 'react';
import { Button, Text } from '@chakra-ui/react';

import { openTab } from '~libs/client-core';

export function LinkToLogin(): JSX.Element {
	return (
		<section>
			<Button
				onClick={() => openTab('tabs.html')}
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
					onClick={() => openTab('tabs.html')}
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
