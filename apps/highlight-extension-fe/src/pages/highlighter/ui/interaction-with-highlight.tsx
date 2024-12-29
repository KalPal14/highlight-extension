import React, { useEffect } from 'react';

import { getPageUrl } from '~libs/client-core';

import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';
import { useHighlights } from '~/highlight-extension-fe/entities/highlight';

import { useHighlighter } from '../model/highlighter.hook';
import { scrollToHighlight } from '../model/dom-interactions/scroll-to-highlight';

import { Highlighter } from './highlighter';

export function InteractionWithHighlight(): JSX.Element {
	const {
		data: { currentHighlight, mouseCoordinates },
		actions: {
			handleHighlightClick,
			wipeHighlight,
			refreshHighlight,
			refreshHighlightAfterControlClose,
		},
	} = useHighlighter();
	const {
		data: { deletedHighlight },
		actions: { deleteHighlight },
	} = useHighlights();

	const [scrollHighlightId, setScrollHighlightId] = useCrossBrowserState('scrollHighlightId');

	useEffect(() => {
		document.addEventListener('click', handleHighlightClick);
		return (): void => {
			document.removeEventListener('click', handleHighlightClick);
		};
	}, []);

	useEffect(() => {
		if (!deletedHighlight || deletedHighlight.pageUrl !== getPageUrl()) return;
		wipeHighlight(deletedHighlight.highlight);
	}, [deletedHighlight]);

	useEffect(() => {
		scrollToHighlight(scrollHighlightId, () => setScrollHighlightId(null));
	}, [scrollHighlightId]);

	if (currentHighlight) {
		return (
			<Highlighter
				startingPoint={mouseCoordinates}
				note={currentHighlight.note ?? undefined}
				forExistingHighlight={true}
				onSelectColor={(color, note) => refreshHighlight({ color, note })}
				onControllerClose={(color, note) => refreshHighlightAfterControlClose({ color, note })}
				onDeleteClick={() => {
					if (!currentHighlight) return;
					deleteHighlight(currentHighlight.highlightId, getPageUrl());
				}}
			/>
		);
	}

	return <></>;
}
