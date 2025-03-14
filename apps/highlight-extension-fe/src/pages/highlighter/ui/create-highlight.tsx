import React, { useEffect } from 'react';

import { useExceptionHandler } from '~libs/react-core';

import { useHighlighter } from '../model/highlighter.hook';

import { Highlighter } from './highlighter';

export function CreateHighlight(): JSX.Element {
	const {
		data: { selectedRanges, mouseCoordinates },
		actions: { handleTextSelection, createAndDrawHighlight },
	} = useHighlighter();
	const { toastContentScriptsException } = useExceptionHandler();

	useEffect(() => {
		document.addEventListener('mouseup', handleTextSelection);
		return (): void => {
			document.removeEventListener('mouseup', handleTextSelection);
		};
	}, []);

	async function drawHighlight(color: string, note?: string): Promise<void> {
		try {
			await createAndDrawHighlight(color, note);
		} catch (err) {
			toastContentScriptsException(err);
		}
	}

	if (selectedRanges.length) {
		return (
			<Highlighter
				startingPoint={mouseCoordinates}
				onSelectColor={drawHighlight}
				onControllerClose={async (color, note) => {
					if (!note) return;
					await drawHighlight(color, note);
				}}
			/>
		);
	}

	return <></>;
}
