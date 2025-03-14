import { useState } from 'react';

import { IDocumentPoint } from '~libs/client-core';

interface IHighlighterHookReturn {
	data: {
		selectedRanges: Range[];
		mouseCoordinates: IDocumentPoint;
	};
	actions: {
		handleTextSelection(mouseEvent: MouseEvent): void;
	};
}

export function useHighlighter(): IHighlighterHookReturn {
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

	return {
		data: {
			selectedRanges,
			mouseCoordinates,
		},
		actions: {
			handleTextSelection,
		},
	};
}
