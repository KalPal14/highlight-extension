import React from 'react';
import { useToast } from '@chakra-ui/react';
import { UseFormSetError } from 'react-hook-form';

import { UpdateUserDto } from '~libs/dto/iam';
import { toastSuccessOptions, useExceptionHandler } from '~libs/react-core';

import { useUsers } from '~/highlight-extension-fe/entities/user';

import { ChangeEmailForm } from './forms/change-email-form';
import { ChangePasswordForm } from './forms/change-password-form';
import { ChangeUsernameForm } from './forms/change-username-form';

export function UserInfoTab(): JSX.Element {
	const {
		data: { currentUser },
		actions: { updateUser },
	} = useUsers();
	const { toastException } = useExceptionHandler();

	const toast = useToast(toastSuccessOptions);

	async function onUserUpdate(
		dto: UpdateUserDto,
		setFormError?: UseFormSetError<UpdateUserDto>
	): Promise<boolean> {
		try {
			await updateUser(dto);
			toast({ title: 'Email has been successfully changed' });
			return true;
		} catch (err) {
			toastException(err, { onValidation: setFormError });
			return false;
		}
	}

	return (
		<section className="options_userInfoTab">
			{currentUser && (
				<>
					<ChangeEmailForm
						currentEmail={currentUser.email}
						onUserUpdate={onUserUpdate}
					/>
					<ChangeUsernameForm
						currentUsername={currentUser.username}
						onUserUpdate={onUserUpdate}
					/>
					<ChangePasswordForm
						passwordUpdatedAt={currentUser.passwordUpdatedAt}
						onUserUpdate={onUserUpdate}
					/>
				</>
			)}
		</section>
	);
}
