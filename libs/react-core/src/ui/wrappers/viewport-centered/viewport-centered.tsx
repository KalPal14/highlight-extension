import React from 'react';

import './styles.scss';

interface IViewportCenteredProps {
	children: JSX.Element;
}

export function ViewportCentered({ children }: IViewportCenteredProps): JSX.Element {
	return (
		<div className="viewportCentered">
			<div className="viewportCentered_content">{children}</div>
		</div>
	);
}
