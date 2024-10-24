export interface ITab<Names = string> {
	label: string;
	name: Names;
	element?: JSX.Element;
}
