import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Divider, Text, Tooltip } from '@chakra-ui/react';
import cl from 'classnames';

import { IBaseHighlightRo } from '~libs/ro/highlight-extension';
import { ExclamationOctagonSVG } from '~libs/react-core';
import { browserAdapter } from '~libs/client-core';

import { useHighlights } from '~/highlight-extension-fe/entities/highlight';

import { IChangeHighlightForm } from './types/change-highlight-form.interface';

export interface IHighlightsListItemProps {
	register: UseFormRegister<IChangeHighlightForm>;
	highlight: IBaseHighlightRo;
	index: number;
	activeTabUrl: string;
}

export function HighlightsListItem({
	register,
	highlight,
	index,
	activeTabUrl,
}: IHighlightsListItemProps): JSX.Element {
	const {
		data: { unfoundHighlightsIds },
	} = useHighlights();

	const unfoundHighlight = unfoundHighlightsIds[activeTabUrl]?.includes(highlight.id);

	return (
		<div
			{...register(`highlights.${index}`, {})}
			className="highlightsList_itemContent"
		>
			{unfoundHighlight && (
				<Tooltip label="This note is only in the sidebar">
					<div className="highlightsList_exclamationSvgContainer">
						<ExclamationOctagonSVG />
					</div>
				</Tooltip>
			)}
			<Text
				className={cl('highlightsList_itemContentText', browserAdapter.browserName, {
					found: !unfoundHighlight,
				})}
				fontSize="md"
				color={highlight.color}
			>
				{highlight.text}
			</Text>
			{highlight.note && (
				<>
					<Divider
						className="highlightsList_itemContentDivider"
						borderColor="gray.400"
					/>
					<Text
						fontSize="md"
						color="gray.400"
					>
						{highlight.note}
					</Text>
				</>
			)}
		</div>
	);
}
