import { useRef, useState } from 'react';
import { isEqual } from 'lodash';

import { getPageUrl, IDocumentPoint } from '~libs/client-core';
import { Exception } from '~libs/common';
import { IBaseHighlightRo } from '~libs/ro/highlight-extension';

import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';
import { useHighlights } from '~/highlight-extension-fe/entities/highlight';
import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

import { createRangeFromHighlightRo } from './dom-interactions/dom-editing/create-range-from-highlight-ro';
import { drawHighlight } from './dom-interactions/dom-editing/draw-highlight';
import { buildCreateHighlightDto } from './dom-interactions/build-create-highlight-dto';

interface IHighlighterHookReturn {
	data: {
		selectedRanges: Range[];
		mouseCoordinates: IDocumentPoint;
	};
	actions: {
		handleTextSelection(mouseEvent: MouseEvent): void;
		getAndDrawHighlights(
			onHighlightsReceived: (drawn: number, undrawn: number) => void
		): Promise<void>;
		createAndDrawHighlight(color: string, note?: string): Promise<void>;
	};
}

export function useHighlighter(): IHighlighterHookReturn {
	const [, setUnfoundHighlightsIds] = useCrossBrowserState('unfoundHighlightsIds');

	const { currentWorkspace } = useWorkspaces().data;
	const { createHighlight, getPageHighlights } = useHighlights().actions;

	const prevHighlights = useRef<IBaseHighlightRo[] | null>(null);

	const [selectedRanges, setSelectedRanges] = useState<Range[]>([]);
	const [mouseCoordinates, setMouseCoordinates] = useState<IDocumentPoint>({ top: 0, left: 0 });

	function handleTextSelection({ target, clientX, pageY }: MouseEvent): void {
		if ((target as HTMLElement).id === 'highlights-ext-container') return;

		const newSelection = document.getSelection();
		if (!newSelection || newSelection.type !== 'Range') {
			setSelectedRanges([]);
			return;
		}

		setSelectedRanges(() =>
			[...Array(newSelection.rangeCount)].map((_, index) => newSelection.getRangeAt(index))
		);
		setMouseCoordinates({ left: clientX, top: pageY });
	}

	async function getAndDrawHighlights(
		onHighlightsReceived: (drawn: number, undrawn: number) => void
	): Promise<void> {
		const highlights = await getPageHighlights(getPageUrl());

		if (isEqual(prevHighlights.current, highlights)) return;
		prevHighlights.current = highlights;

		const newUnfoundHighlightsIds: number[] = [];

		highlights.forEach((highlight) => {
			try {
				const highlightRange = createRangeFromHighlightRo(highlight);
				if (highlightRange.toString() !== highlight.text) {
					newUnfoundHighlightsIds.push(highlight.id);
					return;
				}
				drawHighlight(highlightRange, highlight);
			} catch {
				newUnfoundHighlightsIds.push(highlight.id);
			}
		});

		onHighlightsReceived(
			highlights.length - newUnfoundHighlightsIds.length,
			newUnfoundHighlightsIds.length
		);
		setUnfoundHighlightsIds((prevState) => ({
			...prevState,
			[getPageUrl()]: newUnfoundHighlightsIds,
		}));
	}

	async function createAndDrawHighlight(color: string, note?: string): Promise<void> {
		if (!currentWorkspace) throw new Exception('User is not authorised');
		if (!selectedRanges.length)
			throw new Exception('There is no text in the fragment you have highlighted');

		const newHighlightData = buildCreateHighlightDto(
			currentWorkspace.id,
			selectedRanges,
			color,
			note
		);
		if (!newHighlightData) throw new Exception('Something went wrong. Please try again.');

		const highlight = await createHighlight(newHighlightData);
		const highlightRange = createRangeFromHighlightRo(highlight);
		drawHighlight(highlightRange, highlight);
		setSelectedRanges([]);
	}

	return {
		data: {
			selectedRanges,
			mouseCoordinates,
		},
		actions: {
			handleTextSelection,
			getAndDrawHighlights,
			createAndDrawHighlight,
		},
	};
}
