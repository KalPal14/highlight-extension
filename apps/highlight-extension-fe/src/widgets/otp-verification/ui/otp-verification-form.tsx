import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, useToast } from '@chakra-ui/react';

import { ValidateOtpDto } from '~libs/dto/iam';
import { TextField, useExceptionHandler, toastDefOptions } from '~libs/react-core';

import { useOtp } from '~/highlight-extension-fe/entities/otp';

export interface IOtpVerificationFormProps {
	formControls: UseFormReturn<ValidateOtpDto>;
	onSuccess: () => void;
	onChangeEmailClick: () => void;
}

export function OtpVerificationForm({
	formControls,
	onSuccess,
	onChangeEmailClick,
}: IOtpVerificationFormProps): JSX.Element {
	const { validateOtp } = useOtp().actions;
	const { toastException } = useExceptionHandler();

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = formControls;
	const toast = useToast(toastDefOptions);

	async function onSubmit(formValue: ValidateOtpDto): Promise<void> {
		try {
			await validateOtp(formValue);
			onSuccess();
		} catch (err) {
			const unexpectedMsg = 'We were unable to resend the code. Please try again';

			toastException(err, {
				unexpectedMsg: { title: unexpectedMsg },
				onValidation(property: string, error: { message: string }) {
					if (property === 'email') {
						toast({ title: unexpectedMsg });
					}
					setError(property as keyof Omit<ValidateOtpDto, 'email'>, error);
				},
			});
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TextField
				type="number"
				register={register}
				errors={errors.code}
				name="code"
				label="Email verification code"
				placeholder="Please enter here the code you received in the e-mail."
			/>
			<Button
				mt={2}
				colorScheme="teal"
				isLoading={isSubmitting}
				type="submit"
			>
				Submit
			</Button>
			<Button
				mt={2}
				ml={2}
				colorScheme="gray"
				isLoading={isSubmitting}
				onClick={onChangeEmailClick}
			>
				Change Email
			</Button>
		</form>
	);
}
