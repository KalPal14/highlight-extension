import { useEffect, useRef, useState } from 'react';
import { isEqual, union } from 'lodash';

import { dispatchApiRequest, getPageUrl, IDocumentPoint } from '~libs/client-core';
import { Exception } from '~libs/common';
import { GetHighlightsDto, UpdateHighlightDto } from '~libs/dto/highlight-extension';
import {
	IBaseHighlightRo,
	IDeleteHighlightRo,
	IUpdateHighlightRo,
	TGetHighlightsRo,
} from '~libs/ro/highlight-extension';
import { HIGHLIGHTS_URLS } from '~libs/routes/highlight-extension';

import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';
import { useHighlights } from '~/highlight-extension-fe/entities/highlight';
import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

import { createRangeFromHighlightRo } from './dom-interactions/dom-editing/create-range-from-highlight-ro';
import { drawHighlight } from './dom-interactions/dom-editing/draw-highlight';
import { buildCreateHighlightDto } from './dom-interactions/build-create-highlight-dto';
import { IHighlightElementData } from './types/highlight-element-data-interface';
import { getNestedHighlightsIds } from './dom-interactions/dom-data-receiving/get-nested-highlights-Ids';
import { createHighlighterElement } from './dom-interactions/dom-editing/create-highlighter-element';

interface IHighlighterHookReturn {
	data: {
		selectedRanges: Range[];
		currentHighlight: IHighlightElementData | null;
		mouseCoordinates: IDocumentPoint;
	};
	actions: {
		handleTextSelection(mouseEvent: MouseEvent): void;
		handleHighlightClick(event: MouseEvent): void;
		getAndDrawHighlights(
			onHighlightsReceived: (drawn: number, undrawn: number) => void
		): Promise<void>;
		createAndDrawHighlight(color: string, note?: string): Promise<void>;
		wipeHighlight(highlight: IDeleteHighlightRo): Promise<void>;
		refreshHighlight(dto: UpdateHighlightDto, pageUrl?: string): Promise<void>;
		refreshHighlightAfterControlClose(dto: UpdateHighlightDto, pageUrl?: string): Promise<void>;
	};
}

export function useHighlighter(): IHighlighterHookReturn {
	const [, setUnfoundHighlightsIds] = useCrossBrowserState('unfoundHighlightsIds');

	const { currentWorkspace } = useWorkspaces().data;
	const { createHighlight, updateHighlight, getPageHighlights } = useHighlights().actions;

	const highlightElementRef = useRef<IHighlightElementData | null>(null);
	const highlightElementToSetRef = useRef<IHighlightElementData | null>(null);
	const prevHighlights = useRef<IBaseHighlightRo[] | null>(null);

	const [selectedRanges, setSelectedRanges] = useState<Range[]>([]);
	const [mouseCoordinates, setMouseCoordinates] = useState<IDocumentPoint>({ top: 0, left: 0 });
	const [currentHighlight, setCurrentHighlight] = useState<IHighlightElementData | null>(null);
	const [highlightSetDispatcher, setHighlightSetDispatcher] = useState(false);

	useEffect(() => {
		setCurrentHighlight(highlightElementToSetRef.current);
		highlightElementRef.current = highlightElementToSetRef.current;
	}, [highlightSetDispatcher]);

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

	function handleHighlightClick(event: MouseEvent): void {
		const target = event.target as HTMLElement | null;
		if (!target || target.tagName === 'HIGHLIGHTS-EXT-CONTAINER') return;

		setCurrentHighlight(null);

		if (target.tagName !== 'WEB-HIGHLIGHT' || document.getSelection()?.type === 'Range') return;
		highlightElementToSetRef.current = {
			elementId: target.id,
			highlightId: Number(target.id.split('web-highlight-')[1]),
			color: target.style.backgroundColor,
			note: target.getAttribute('data-higlight-note'),
		};
		setHighlightSetDispatcher((prevState) => !prevState);
		setMouseCoordinates({ left: event.clientX, top: event.pageY });
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

	async function wipeHighlight(highlight: IDeleteHighlightRo): Promise<void> {
		await _redrawWithNested(
			highlight,
			(element) => (element.outerHTML = element.getAttribute('data-initial-text')!)
		);
	}

	async function refreshHighlight(dto: UpdateHighlightDto, pageUrl?: string): Promise<void> {
		if (!currentHighlight) return;

		const highlight = await updateHighlight(currentHighlight.highlightId, dto, pageUrl);
		redrawHighlight(highlight);
	}

	async function refreshHighlightAfterControlClose(
		dto: UpdateHighlightDto,
		pageUrl?: string
	): Promise<void> {
		if (!highlightElementRef.current) return;
		if (!dto.note && !highlightElementRef.current.note) return;
		if (dto.note === highlightElementRef.current.note) return;

		const highlight = await updateHighlight(highlightElementRef.current.highlightId, dto, pageUrl);
		_redrawWithNested(highlight, (element) => {
			const newElement = createHighlighterElement(element.textContent!, highlight);
			element.replaceWith(newElement);
		});
	}

	function redrawHighlight(highlight: IUpdateHighlightRo): void {
		const highlighterElements = document.querySelectorAll(`#web-highlight-${highlight.id}`);
		highlighterElements.forEach((highlighterElement) => {
			if (!highlighterElement.textContent) return;
			const newHighlighterElement = createHighlighterElement(
				highlighterElement.textContent,
				highlight
			);
			highlighterElement.replaceWith(newHighlighterElement);
		});
	}

	async function _redrawWithNested(
		highlight: IDeleteHighlightRo,
		redrawCurrent: (element: Element) => void
	): Promise<void> {
		const nestedHighlightsIds: number[][] = [];

		const highlighterElements = document.querySelectorAll(`#web-highlight-${highlight.id}`);
		highlighterElements.forEach((highlighterElement) => {
			if (!highlighterElement.textContent) return;
			redrawCurrent(highlighterElement);

			const nestedToThisHighlightIds = getNestedHighlightsIds(highlighterElement);
			nestedHighlightsIds.push(nestedToThisHighlightIds);
		});

		const nestedHighlights = await dispatchApiRequest.get<GetHighlightsDto, TGetHighlightsRo>(
			HIGHLIGHTS_URLS.getMany,
			{ ids: JSON.stringify(union(...nestedHighlightsIds)) }
		);
		nestedHighlights.forEach((highlight) => {
			const highlightRange = createRangeFromHighlightRo(highlight);
			drawHighlight(highlightRange, highlight);
		});
		setCurrentHighlight(null);
	}

	return {
		data: {
			selectedRanges,
			currentHighlight,
			mouseCoordinates,
		},
		actions: {
			handleTextSelection,
			handleHighlightClick,
			getAndDrawHighlights,
			createAndDrawHighlight,
			wipeHighlight,
			refreshHighlight,
			refreshHighlightAfterControlClose,
		},
	};
}
