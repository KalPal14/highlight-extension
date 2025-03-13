import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

import { LoginDto } from '~libs/dto/iam';
import { TextField, useExceptionHandler } from '~libs/react-core';

import { useUsers } from '~/highlight-extension-fe/entities/user';

export function LoginForm(): JSX.Element {
	const { login } = useUsers().actions;
	const { toastException } = useExceptionHandler();

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<LoginDto>();

	async function onSubmit(formValues: LoginDto): Promise<void> {
		try {
			await login(formValues);
		} catch (error) {
			toastException(error, { onValidation: setError });
		}
	}

	return (
		<form
			className="loginPage_form"
			onSubmit={handleSubmit(onSubmit)}
		>
			<TextField
				register={register}
				errors={errors.userIdentifier}
				name="userIdentifier"
				label="Email or username"
				placeholder="Please enter email or usernamee"
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
