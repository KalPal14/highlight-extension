import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Toast, useExceptionHandler } from '~libs/react-core';

import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

import { useHighlighter } from '../model/highlighter.hook';

import { CreateHighlight } from './create-highlight';
import styles from './styles.shadow-dom.scss';

export function HighlighterPage(): JSX.Element {
	const {
		actions: { getAndDrawHighlights },
	} = useHighlighter();
	const { toastContentScriptsException } = useExceptionHandler();

	const [isExtActive] = useCrossBrowserState('isExtActive');
	const [currentWorkspace] = useCrossBrowserState('currentWorkspace');

	useEffect(() => {
		if (!isExtActive || !currentWorkspace) {
			const highlights = document.getElementsByTagName('WEB-HIGHLIGHT');
			if (!highlights.length) return;
			window.location.reload();
			return;
		}
		getHighlights();
	}, [isExtActive, currentWorkspace]);

	async function getHighlights(): Promise<void> {
		try {
			await getAndDrawHighlights((drawn: number, undrawn: number) => {
				if (drawn)
					toast(
						<Toast
							status="success"
							title={`${drawn} highlight${drawn > 1 ? 's' : ''} successfully found in text`}
						/>
					);
				if (undrawn)
					toast(
						<Toast
							status="warning"
							title={`${undrawn} highlight${undrawn > 1 ? 's' : ''} not found in text`}
							description="You can see them by opening the sidepanel"
						/>
					);
			});
		} catch (err) {
			toastContentScriptsException(err);
		}
	}

	return (
		<>
			<style>{String(styles)}</style>
			<main>
				{isExtActive && (
					<>
						<Toaster position="bottom-center" />
						<CreateHighlight />
					</>
				)}
			</main>
		</>
	);
}
