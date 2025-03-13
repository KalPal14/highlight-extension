import React from 'react';
import { UseFormSetError } from 'react-hook-form';

import { UpdateUserDto } from '~libs/dto/iam';
import { AccordionForm } from '~libs/react-core';

import { OtpVerification } from '~/highlight-extension-fe/widgets/otp-verification';

export interface IChangeEmailFormProps {
	currentEmail: string;
	onUserUpdate: (
		dto: UpdateUserDto,
		setFormError?: UseFormSetError<UpdateUserDto>
	) => Promise<boolean>;
}

export function ChangeEmailForm({
	currentEmail,
	onUserUpdate,
}: IChangeEmailFormProps): JSX.Element {
	return (
		<AccordionForm
			childrenType="form"
			onSubmitHandler={onUserUpdate}
			accordionButtonText={currentEmail}
			tooltipLabel="Edit"
			labelText="Email"
		>
			<OtpVerification
				shouldBeNewUser={true}
				onSuccess={onUserUpdate}
			/>
		</AccordionForm>
	);
}
