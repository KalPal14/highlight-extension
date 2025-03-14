import React, { useEffect } from 'react';

import { useHighlighter } from '../model/highlighter.hook';

import { Highlighter } from './highlighter';

export function CreateHighlight(): JSX.Element {
	const {
		data: { selectedRanges, mouseCoordinates },
		actions: { handleTextSelection },
	} = useHighlighter();

	useEffect(() => {
		document.addEventListener('mouseup', handleTextSelection);
		return (): void => {
			document.removeEventListener('mouseup', handleTextSelection);
		};
	}, []);

	if (selectedRanges.length) {
		return (
			<Highlighter
				startingPoint={mouseCoordinates}
				onSelectColor={(color, note) =>
					console.log(`draw highlight with color ${color} and note ${note}`)
				}
				onControllerClose={async (color, note) => {
					if (!note) return;
					console.log(`draw highlight with color ${color} and note ${note}`);
				}}
			/>
		);
	}

	return <></>;
}
