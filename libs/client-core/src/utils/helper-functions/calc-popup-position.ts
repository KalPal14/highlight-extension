import { IDocumentPoint } from '~libs/client-core/types/document-point.interface';

interface IElementSize {
	w: number;
	h: number;
	offset?: Partial<IDocumentPoint>;
}

export function calcPopupPosition(
	startPoint: IDocumentPoint,
	element: IElementSize,
	maxSpaceToEdges: number = 10
): IDocumentPoint {
	const offcetTop = element.offset?.top ?? 0;
	const offsetLeft = element.offset?.left ?? 0;

	const spaceToPageEdges = {
		top: startPoint.top + offcetTop - maxSpaceToEdges,
		right: window.innerWidth - startPoint.left - offsetLeft - element.w - maxSpaceToEdges,
		bottom:
			Math.max(document.body.scrollHeight, window.innerHeight) -
			startPoint.top -
			offcetTop -
			element.h -
			maxSpaceToEdges,
		left: startPoint.left + offsetLeft - maxSpaceToEdges,
	};

	let top = startPoint.top + offcetTop;
	let left = startPoint.left + offsetLeft;

	if (spaceToPageEdges.top < 0) top = top - spaceToPageEdges.top;
	if (spaceToPageEdges.left < 0) left = left - spaceToPageEdges.left;
	if (spaceToPageEdges.bottom < 0) top = top + spaceToPageEdges.bottom;
	if (spaceToPageEdges.right < 0) left = left + spaceToPageEdges.right;

	return {
		top,
		left,
	};
}
