import React from 'react';

import { CreateHighlight } from './create-highlight';
import styles from './styles.shadow-dom.scss';

export function HighlighterPage(): JSX.Element {
	return (
		<>
			<style>{String(styles)}</style>
			<main>
				<CreateHighlight />
			</main>
		</>
	);
}
