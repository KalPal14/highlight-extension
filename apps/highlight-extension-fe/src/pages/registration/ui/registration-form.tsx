import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

import { RegistrationDto } from '~libs/dto/iam';
import { TextField, useExceptionHandler } from '~libs/react-core';

import { useUsers } from '~/highlight-extension-fe/entities/user';

export interface IRegistrationFormProps {
	email: string;
}

export function RegistrationForm({ email }: IRegistrationFormProps): JSX.Element {
	const { registration } = useUsers().actions;
	const { toastException } = useExceptionHandler();

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<Omit<RegistrationDto, 'email'>>();

	async function onSubmit(formValues: Omit<RegistrationDto, 'email'>): Promise<void> {
		try {
			await registration({ email, ...formValues });
		} catch (error) {
			toastException(error, { onValidation: setError });
		}
	}

	return (
		<form
			className="registrationPage_form"
			onSubmit={handleSubmit(onSubmit)}
		>
			<TextField
				register={register}
				errors={errors.username}
				name="username"
				label="Username"
				placeholder="Please enter username"
			/>
			<TextField
				register={register}
				errors={errors.password}
				name="password"
				label="Password"
				placeholder="Please enter your password"
				type="password"
			/>
			<Button
				mt={2}
				colorScheme="teal"
				isLoading={isSubmitting}
				type="submit"
			>
				Submit
			</Button>
		</form>
	);
}
