import React from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import date from 'date-and-time';

import { UpdateUserDto } from '~libs/dto/iam';
import { TextField, AccordionForm } from '~libs/react-core';

export interface IChangePasswordFormProps {
	passwordUpdatedAt: Date | null;
	onUserUpdate: (
		dto: UpdateUserDto,
		setFormError?: UseFormSetError<UpdateUserDto>
	) => Promise<boolean>;
}

export function ChangePasswordForm({
	passwordUpdatedAt,
	onUserUpdate,
}: IChangePasswordFormProps): JSX.Element {
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
			accordionButtonText={
				passwordUpdatedAt
					? `Last update: ${date.format(new Date(passwordUpdatedAt), 'YYYY/MM/DD HH:mm')}`
					: 'Never updated'
			}
			tooltipLabel="Edit"
			labelText="Password"
		>
			<>
				<TextField
					register={register}
					errors={errors.password?.currentPassword}
					name="password.currentPassword"
					label="Current password"
					placeholder="Please enter your current password"
					type="password"
				/>
				<TextField
					register={register}
					errors={errors.password?.newPassword}
					name="password.newPassword"
					label="New password"
					placeholder="Please enter a new password"
					type="password"
				/>
			</>
		</AccordionForm>
	);
}
