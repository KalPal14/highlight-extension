import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

interface IExtensionHookReturn {
	data: { isExtActive: boolean };
	actions: { toggleExtension(): void };
}

export function useExtension(): IExtensionHookReturn {
	const [isExtActive, setIsExtActive] = useCrossBrowserState('isExtActive');

	function toggleExtension(): void {
		setIsExtActive((prev) => !prev);
	}

	return { data: { isExtActive }, actions: { toggleExtension } };
}
