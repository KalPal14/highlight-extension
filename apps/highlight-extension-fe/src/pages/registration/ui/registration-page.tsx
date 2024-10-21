import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Heading } from '@chakra-ui/react';

import { HighAlert, ViewportCentered } from '~libs/react-core';

import { TABS_ROUTES } from '~/highlight-extension-fe/shared/ui';
import { OtpVerification } from '~/highlight-extension-fe/widgets/otp-verification';
import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

import { RegistrationForm } from './registration-form';

export function RegistrationPage(): JSX.Element {
	const [jwt] = useCrossBrowserState('jwt');

	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [email, setEmail] = useState('');

	useEffect(() => {
		setIsOtpVerified(false);
		setEmail('');
	}, [jwt]);

	return (
		<ViewportCentered>
			<main className="registrationPage">
				{!jwt && (
					<section className="registrationPage_formSection">
						<Heading as="h1">Registration</Heading>
						<Text>
							Want to log into an existing account?{' '}
							<Text
								color="teal.500"
								as="u"
								cursor="pointer"
							>
								<Link to={TABS_ROUTES.login}>Please login here</Link>
							</Text>
						</Text>
						{isOtpVerified ? (
							<RegistrationForm email={email} />
						) : (
							<OtpVerification
								shouldBeNewUser={true}
								onSuccess={({ email }) => {
									setEmail(email);
									setIsOtpVerified(true);
								}}
							/>
						)}
					</section>
				)}
				{Boolean(jwt) && (
					<HighAlert
						title="You have successfully registered"
						description="You can close this tab. To register a new account, please log out of the current on"
						status="success"
						className="registrationPage_alert"
					/>
				)}
			</main>
		</ViewportCentered>
	);
}
