import { CrossBrowserStateBuilder } from '~libs/react-core';

import { defaultCrossBrowserStateValues } from './constants/default-cross-browser-state-values';

const crossBrowserState = new CrossBrowserStateBuilder(defaultCrossBrowserStateValues);

export const useCrossBrowserState = crossBrowserState.useCrossBrowserState.bind(crossBrowserState);
