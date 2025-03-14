import React, { useEffect } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Heading } from '@chakra-ui/react';

import { DraggableFields } from '~libs/react-core';
import { IBaseHighlightRo } from '~libs/ro/highlight-extension';

import { useHighlights } from '~/highlight-extension-fe/entities/highlight';

import { HighlightsListItem } from './highlights-list-item';
import { IChangeHighlightForm } from './types/change-highlight-form.interface';

export interface IHighlightsListProps {
	formControls: UseFormReturn<IChangeHighlightForm>;
	highlightsFieldControls: UseFieldArrayReturn<IChangeHighlightForm, 'highlights', 'id'>;
	activeTabUrl: string;
	highlights?: IBaseHighlightRo[];
}

export function HighlightsList({
	formControls,
	highlightsFieldControls,
	activeTabUrl,
	highlights,
}: IHighlightsListProps): JSX.Element {
	const {
		data: { createdHighlight, deletedHighlight, updatedHighlight },
		actions: {
			appendHighlightField,
			removeHighlightField,
			updeteHighlightField,
			deleteHighlight,
			updateHighlightsOrder,
		},
	} = useHighlights();

	const { register, watch } = formControls;
	const fieldArrayControls = highlightsFieldControls;
	const { fields, append, remove, update } = fieldArrayControls;

	useEffect(() => {
		appendHighlightField(activeTabUrl, append);
	}, [createdHighlight]);

	useEffect(() => {
		removeHighlightField(activeTabUrl, fields, remove);
	}, [deletedHighlight]);

	useEffect(() => {
		updeteHighlightField(activeTabUrl, fields, update);
	}, [updatedHighlight]);

	async function onDeleteHighlight(index: number): Promise<void> {
		const { highlight } = fields[index];
		await deleteHighlight(highlight.id, activeTabUrl);
	}

	async function onHighlightsSortEnd(): Promise<void> {
		const highlights = watch('highlights');
		updateHighlightsOrder(highlights.map(({ highlight }) => highlight));
	}

	if (!fields.length || (highlights && !highlights.length)) {
		return (
			<Heading
				as="h6"
				size="md"
				textAlign="center"
			>
				This list of notes is empty
			</Heading>
		);
	}

	return (
		<DraggableFields
			fieldArrayControls={fieldArrayControls}
			showDeleteBtn={true}
			onDelete={onDeleteHighlight}
			onSortEnd={onHighlightsSortEnd}
			fieldsList={((): (React.JSX.Element | null)[] => {
				const highlightsIds = (highlights ?? []).map(({ id }) => id);
				const needToSort = highlights && highlightsIds.length !== fields.length;
				return fields.map(({ highlight }, index) => {
					if (needToSort && !highlightsIds.includes(highlight.id)) return null;
					return (
						<HighlightsListItem
							key={highlight.id}
							register={register}
							highlight={highlight}
							index={index}
							activeTabUrl={activeTabUrl}
						/>
					);
				});
			})()}
		/>
	);
}
