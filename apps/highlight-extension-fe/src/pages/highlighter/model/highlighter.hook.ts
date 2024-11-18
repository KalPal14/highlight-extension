import { useState } from 'react';

import { IDocumentPoint } from '~libs/client-core';
import { Exception } from '~libs/common';

import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';
import { useHighlights } from '~/highlight-extension-fe/entities/highlight';

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
		createAndDrawHighlight(color: string, note?: string): Promise<void>;
	};
}

export function useHighlighter(): IHighlighterHookReturn {
	const { currentWorkspace } = useWorkspaces().data;
	const { createHighlight } = useHighlights().actions;

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
			createAndDrawHighlight,
		},
	};
}
