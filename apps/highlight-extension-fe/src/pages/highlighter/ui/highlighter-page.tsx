import React from 'react';

import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

import { CreateHighlight } from './create-highlight';
import styles from './styles.shadow-dom.scss';

export function HighlighterPage(): JSX.Element {
	const [isExtActive] = useCrossBrowserState('isExtActive');

	return (
		<>
			<style>{String(styles)}</style>
			<main>{isExtActive && <CreateHighlight />}</main>
		</>
	);
}
