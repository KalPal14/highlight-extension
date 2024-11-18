import { IBaseHighlightRo } from '~libs/ro/highlight-extension';

import { INodeInRange } from '../../types/node-in-range.interface';
import { findTextToHighlight } from '../dom-data-receiving/find-text-to-highlight';

import { createHighlighterElement } from './create-highlighter-element';

export function drawHighlight(range: Range, highlight: IBaseHighlightRo): void {
	const nodesInRangeList = findTextToHighlight(range.commonAncestorContainer, range);

	nodesInRangeList.forEach(({ node, textContent }, index) => {
		let text = textContent;
		if (index === nodesInRangeList.length - 1 && !textContent.isAllInRange) {
			text = fixRangeTextContent(textContent, highlight.text);
		}
		wrapTextWithHighlighterElement(node, text, highlight);
	});
}

function fixRangeTextContent(
	textContent: INodeInRange['textContent'],
	highlightText: string
): INodeInRange['textContent'] {
	const textContentAddedLetter = addLetter(textContent);
	const textContentRemovedLetter = removeLetter(textContent);

	if (highlightText.endsWith(textContentAddedLetter.strInRange)) {
		return textContentAddedLetter;
	}
	if (highlightText.endsWith(textContentRemovedLetter.strInRange)) {
		return textContentRemovedLetter;
	}
	return textContent;
}

function addLetter({
	strBeforeRange,
	strInRange,
	strAfterRange,
}: INodeInRange['textContent']): INodeInRange['textContent'] {
	return {
		strBeforeRange,
		strInRange: strInRange + strAfterRange[0],
		strAfterRange: strAfterRange.slice(1),
	};
}

function removeLetter({
	strBeforeRange,
	strInRange,
	strAfterRange,
}: INodeInRange['textContent']): INodeInRange['textContent'] {
	return {
		strBeforeRange,
		strInRange: strInRange.slice(0, strInRange.length - 1),
		strAfterRange: strInRange[strInRange.length - 1] + strAfterRange,
	};
}

function wrapTextWithHighlighterElement(
	textNode: Node,
	{ strBeforeRange, strAfterRange, strInRange }: INodeInRange['textContent'],
	highlight: IBaseHighlightRo
): void {
	if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent || !textNode.parentElement) {
		return;
	}

	const wrapper = createHighlighterElement(strInRange, highlight);
	textNode.parentElement.replaceChild(wrapper, textNode);
	wrapper.before(strBeforeRange);
	wrapper.after(strAfterRange);
}
