import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

import {
	AccordionForm,
	DraggableFields,
	ColorField,
	useExceptionHandler,
	toastSuccessOptions,
} from '~libs/react-core';

import { useWorkspaces } from '~/highlight-extension-fe/entities/workspace';
import { DEF_COLORS } from '~/highlight-extension-fe/shared/model';

import { IChangeColorsForm } from '../types/change-colors-form.interface';

export function ChangeColorsForm(): JSX.Element {
	const {
		data: { currentWorkspace },
		actions: { updateWorkspace },
	} = useWorkspaces();
	const colors = currentWorkspace?.colors.length ? currentWorkspace.colors : DEF_COLORS;

	const { toastException } = useExceptionHandler();

	const formControls = useForm<IChangeColorsForm>({
		values: {
			colors: colors.map((color) => ({ color })),
		},
	});
	const { register, control, setError } = formControls;
	const fieldArrayControls = useFieldArray({
		control,
		name: 'colors',
	});
	const { fields } = fieldArrayControls;
	const toast = useToast(toastSuccessOptions);

	async function onSubmit(formValues: IChangeColorsForm): Promise<boolean> {
		try {
			await updateWorkspace({ colors: formValues.colors.map(({ color }) => color) });
			toast({
				title: 'Colors has been successfully saved',
				status: 'success',
			});
			return true;
		} catch (err) {
			toastException(err, { onValidation: setError });
			return false;
		}
	}

	return (
		<AccordionForm
			formControls={formControls}
			onSubmitHandler={onSubmit}
			accordionButtonText={
				<div className="options_colors">
					{colors.map((color, index) => (
						<div
							key={index}
							className="options_colorsItem"
							style={{
								backgroundColor: color,
							}}
						></div>
					))}
				</div>
			}
			tooltipLabel="Edit"
			labelText="Highlighter colors"
		>
			<DraggableFields
				fieldArrayControls={fieldArrayControls}
				addBtn={{
					text: '+ Add color',
					value: {
						color: '#718096',
					},
				}}
				showDeleteBtn={true}
				fieldsList={fields.map((field, index) => (
					<ColorField
						key={field.id}
						register={register}
						name={`colors.${index}.color`}
						formControlCl="options_colorFormControl"
						inputCl="options_colorInput"
					/>
				))}
			/>
		</AccordionForm>
	);
}
