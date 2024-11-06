import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { useElementSize } from '@custom-react-hooks/use-element-size';

import { TrashSVG, AlignTextJustifySVG, CogSVG } from '~libs/react-core';
import { calcPopupPosition, dispatchOpenTab, IDocumentPoint } from '~libs/client-core';

import { FULL_OPTIONS_ROUTES } from '~/highlight-extension-fe/shared/ui';
import { DEF_COLORS } from '~/highlight-extension-fe/shared/model';
import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';

export interface IHighlighterProps {
	startingPoint: IDocumentPoint;
	note?: string;
	forExistingHighlight?: boolean;
	onSelectColor: (color: string, note?: string) => void;
	onControllerClose: (color: string, note?: string) => void;
	onDeleteClick?: () => void;
}

export function Highlighter({
	startingPoint,
	note,
	forExistingHighlight,
	onSelectColor,
	onControllerClose,
	onDeleteClick = (): void => {},
}: IHighlighterProps): JSX.Element {
	const { currentWorkspace } = useWorkspaces().data;
	const colors = currentWorkspace?.colors.length ? currentWorkspace.colors : DEF_COLORS;

	const [setColorsRef, colorsSize] = useElementSize<HTMLUListElement>();
	const [setMainPanelBtnsRef, mainPanelBtnsSize] = useElementSize();
	const [setNoteTextareaRef, noteTextareaSize] = useElementSize();

	const { register, watch } = useForm<{ note?: string }>({
		values: {
			note,
		},
	});

	const [showNoteField, setShowNoteField] = useState(Boolean(note));

	useEffect(() => {
		return (): void => onControllerClose(colors[0], watch('note'));
	}, []);

	useEffect(() => {
		setShowNoteField(Boolean(note));
	}, [note]);

	return (
		<article
			className="highlighController"
			style={calcPopupPosition(startingPoint, {
				w: Math.max(colorsSize.width, mainPanelBtnsSize.width, noteTextareaSize.width),
				h: colorsSize.height + mainPanelBtnsSize.height + noteTextareaSize.height,
				offset: { top: -35 },
			})}
		>
			<ul
				ref={setColorsRef}
				className="highlighController_colors"
			>
				{colors.map((color, index) => (
					<li
						key={index}
						className="highlighController_color"
					>
						<div
							key={index}
							onClick={() => onSelectColor(color, watch('note'))}
							style={{
								backgroundColor: color,
							}}
						/>
					</li>
				))}
			</ul>

			<section className="highlighController_mainPanel">
				<div
					ref={setMainPanelBtnsRef}
					className="highlighController_mainPanelBtnsContainer"
				>
					<div
						onClick={() => setShowNoteField(!showNoteField)}
						className="highlighController_noteBtn"
					>
						<AlignTextJustifySVG
							width={24}
							height={24}
							color="#fff"
						/>
					</div>
					<div className="highlighController_otherBtns">
						{forExistingHighlight && (
							<TrashSVG
								width={24}
								height={24}
								onClick={onDeleteClick}
							/>
						)}
						<CogSVG
							width={24}
							height={24}
							onClick={() => dispatchOpenTab({ url: FULL_OPTIONS_ROUTES.colors })}
						/>
					</div>
				</div>
				{showNoteField && (
					<div
						ref={setNoteTextareaRef}
						className="highlighController_noteTextareaContainer"
					>
						<ReactTextareaAutosize
							minRows={3}
							{...register('note')}
							placeholder="Note..."
							rows={5}
							maxRows={10}
							className="highlighController_noteTextarea"
						/>
					</div>
				)}
			</section>
		</article>
	);
}
