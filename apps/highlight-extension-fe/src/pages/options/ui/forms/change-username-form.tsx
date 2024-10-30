import React from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';

import { TextField, AccordionForm } from '~libs/react-core';
import { UpdateUserDto } from '~libs/dto/iam';

export interface IChangeusernameFormProps {
	currentUsername: string;
	onUserUpdate: (
		dto: UpdateUserDto,
		setFormError?: UseFormSetError<UpdateUserDto>
	) => Promise<boolean>;
}

export function ChangeUsernameForm({
	currentUsername,
	onUserUpdate,
}: IChangeusernameFormProps): JSX.Element {
	const formControls = useForm<UpdateUserDto>();
	const {
		register,
		formState: { errors },
		setError,
	} = formControls;

	return (
		<AccordionForm
			formControls={formControls}
			onSubmitHandler={(formValues: UpdateUserDto) => onUserUpdate(formValues, setError)}
			accordionButtonText={currentUsername}
			tooltipLabel="Edit"
			labelText="Username"
		>
			<>
				<TextField
					register={register}
					errors={errors.username}
					name="username"
					label="New username"
					placeholder="Please enter your new username"
				/>
			</>
		</AccordionForm>
	);
}
