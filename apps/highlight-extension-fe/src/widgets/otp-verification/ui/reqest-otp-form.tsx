import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

import { ValidateOtpDto } from '~libs/dto/iam';
import { TextField, useExceptionHandler } from '~libs/react-core';

import { useOtp } from '~/highlight-extension-fe/entities/otp';

interface IRequestOtpFormProps {
	formControls: UseFormReturn<ValidateOtpDto>;
	onSuccess: () => void;
	shouldBeNewUser?: boolean;
}

export function RequestOtpForm({
	formControls,
	shouldBeNewUser,
	onSuccess,
}: IRequestOtpFormProps): JSX.Element {
	const { toastException } = useExceptionHandler();
	const { requestOtp } = useOtp().actions;

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = formControls;

	async function onSubmit({ email }: ValidateOtpDto): Promise<void> {
		try {
			const { testMailUrl } = await requestOtp({ email }, shouldBeNewUser);
			if (testMailUrl) {
				window.open(testMailUrl, '_blank');
			}
			onSuccess();
		} catch (err) {
			toastException(err, { onValidation: setError });
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TextField
				register={register}
				errors={errors.email}
				name="email"
				label="Email"
				placeholder="Please enter email"
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
