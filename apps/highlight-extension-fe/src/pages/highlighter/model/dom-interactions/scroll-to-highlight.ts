export function scrollToHighlight(
	highlightId: `web-highlight-${number}` | null,
	onEnd: () => void
): void {
	if (!highlightId) return;

	const highlights = document.querySelectorAll(`#${highlightId}`);
	const firsScrollHighlight = highlights[0];
	if (!firsScrollHighlight) return;

	const { y } = firsScrollHighlight.getBoundingClientRect();
	window.scrollTo({
		top: y + window.scrollY - 100,
		behavior: 'smooth',
	});

	for (let i = 0; i < highlights.length; i++) {
		const highlight = highlights.item(i) as HTMLElement;
		const currentColor = highlight.style.backgroundColor;
		const effectColor = currentColor.replace(/[^,]+(?=\))/, '0.9');

		highlight.style.backgroundColor = effectColor;
		setTimeout(() => {
			highlight.style.backgroundColor = currentColor;
			onEnd();
		}, 1000);
	}
}
