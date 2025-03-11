export type TOpenTabOptions = {
	tabId?: number;
	windowId?: number;
} & (
	| {
			tabId: number;
	  }
	| {
			windowId: number;
	  }
);
