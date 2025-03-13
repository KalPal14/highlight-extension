import React from 'react';
import { Button } from '@chakra-ui/react';
import { useTimer } from 'react-timer-hook';

import { shiftTime } from '~libs/common';
import { useExceptionHandler } from '~libs/react-core';

import { useOtp } from '~/highlight-extension-fe/entities/otp';

export interface IResendOtpBtnProps {
	email: string;
}

export function ResendOtpBtn({ email }: IResendOtpBtnProps): JSX.Element {
	const { toastException } = useExceptionHandler();
	const { requestOtp } = useOtp().actions;

	const { seconds, isRunning, restart } = useTimer({
		expiryTimestamp: shiftTime(30),
	});

	async function resendCode(): Promise<void> {
		restart(shiftTime(30));

		try {
			const { testMailUrl } = await requestOtp({ email });
			if (testMailUrl) {
				window.open(testMailUrl, '_blank');
			}
		} catch (err) {
			restart(new Date());
			toastException(err, {
				unexpectedMsg: { title: 'We were unable to resend the code. Please try again' },
			});
		}
	}

	return (
		<Button
			mt={5}
			colorScheme="gray"
			isLoading={isRunning}
			loadingText={`Resend code in ${seconds}`}
			spinnerPlacement="end"
			onClick={resendCode}
		>
			Resend code
		</Button>
	);
}
