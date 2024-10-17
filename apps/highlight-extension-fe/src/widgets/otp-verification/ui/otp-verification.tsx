import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ValidateOtpDto } from '~libs/dto/iam';

import { OtpVerificationForm } from './otp-verification-form';
import { RequestOtpForm } from './reqest-otp-form';
import { ResendOtpBtn } from './resend-otp-btn';

export interface IOtpVerificationFormProps {
	shouldBeNewUser?: boolean;
	onSuccess: (data: Pick<ValidateOtpDto, 'email'>) => void;
}

export function OtpVerification({
	shouldBeNewUser,
	onSuccess,
}: IOtpVerificationFormProps): JSX.Element {
	const formControls = useForm<ValidateOtpDto>();
	const { getValues } = formControls;

	const [step, setStep] = useState(0);

	switch (step) {
		case 0:
			return (
				<RequestOtpForm
					formControls={formControls}
					onSuccess={() => setStep(1)}
					shouldBeNewUser={shouldBeNewUser}
				/>
			);
		default:
			return (
				<>
					<OtpVerificationForm
						formControls={formControls}
						onSuccess={() => onSuccess({ email: getValues('email') })}
						onChangeEmailClick={() => setStep(0)}
					/>
					<ResendOtpBtn email={getValues('email')} />
				</>
			);
	}
}
