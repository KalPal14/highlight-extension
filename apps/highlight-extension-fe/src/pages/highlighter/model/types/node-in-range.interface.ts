export interface INodeInRange {
	node: Node;
	textContent: {
		strBeforeRange: string;
		strInRange: string;
		strAfterRange: string;
		isAllInRange?: boolean;
	};
}
