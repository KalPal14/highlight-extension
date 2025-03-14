import { CreateHighlightDto } from '~libs/dto/highlight-extension';
import { getPageUrl } from '~libs/client-core';

import { findElementsByText } from './dom-data-receiving/find-elements-by-text';
import { getHighlightPerent } from './dom-data-receiving/get-highlight-perent';
import { setInitialTextToHighlightPerent } from './dom-editing/set-initial-text-to-highlight-perent';

export function buildCreateHighlightDto(
	workspaceId: number,
	range: Range[],
	color: string,
	note?: string
): CreateHighlightDto | null {
	const firstRange = range[0];
	const lastRange = range[range.length - 1];

	if (
		!firstRange.startContainer.parentElement?.textContent ||
		!lastRange.endContainer.parentElement?.textContent
	) {
		return null;
	}

	setInitialTextToHighlightPerent(firstRange.startContainer.parentElement);
	setInitialTextToHighlightPerent(lastRange.endContainer.parentElement);

	const startContainerPerent = getHighlightPerent(firstRange.startContainer);
	const endContainerPerent = getHighlightPerent(lastRange.endContainer);
	if (!startContainerPerent || !endContainerPerent) return null;

	const startContainerPerentInitialText = startContainerPerent.getAttribute('data-initial-text');
	const endContainerPerentInitialText = endContainerPerent.getAttribute('data-initial-text');
	if (!startContainerPerentInitialText || !endContainerPerentInitialText) return null;

	const sameToStartContainerPerent = findElementsByText(startContainerPerentInitialText);
	const sameToEndContainerPerent = findElementsByText(endContainerPerentInitialText);

	const startNodeIndex = sameToStartContainerPerent.indexOf(startContainerPerent);
	const endNodeIndex = sameToEndContainerPerent.indexOf(endContainerPerent);

	return {
		workspaceId,
		pageUrl: getPageUrl(),
		startOffset: calculateOffset(
			firstRange.startContainer,
			startContainerPerent,
			firstRange.startOffset
		),
		endOffset: calculateOffset(lastRange.endContainer, endContainerPerent, lastRange.endOffset),
		startContainer: {
			text: startContainerPerentInitialText,
			indexNumber: startNodeIndex,
			sameElementsAmount: sameToStartContainerPerent.length,
		},
		endContainer: {
			text: endContainerPerentInitialText,
			indexNumber: endNodeIndex,
			sameElementsAmount: sameToEndContainerPerent.length,
		},
		text: range.map((range) => range.toString()).join(''),
		color,
		note,
	};
}

function calculateOffset(container: Node, perent: HTMLElement, offsetFromRange: number): number {
	let prevNodesTextLength = 0;

	callCalculate(container);

	function callCalculate(node: Node | HTMLElement): void {
		calculate(node);
		if (node.parentElement && node.parentElement !== perent) {
			callCalculate(node.parentElement);
		}
	}

	function calculate(node: Node | HTMLElement): void {
		if (!node.previousSibling) return;
		prevNodesTextLength = prevNodesTextLength + (node.previousSibling.textContent?.length ?? 0);
		calculate(node.previousSibling);
	}

	return offsetFromRange + prevNodesTextLength;
}
