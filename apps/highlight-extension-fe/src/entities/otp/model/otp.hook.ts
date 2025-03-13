import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { IUpsertOtpRo, IValidateOtpRo } from '~libs/ro/iam';
import { OTP_URLS } from '~libs/routes/iam';
import { Exception } from '~libs/common';

import { api } from '~/highlight-extension-fe/shared/api';
import { useUsers } from '~/highlight-extension-fe/entities/user';

interface IOtpHookReturn {
	actions: {
		requestOtp: (dto: UpsertOtpDto, shouldBeNewUser?: boolean) => Promise<IUpsertOtpRo>;
		validateOtp: (dto: ValidateOtpDto, shouldBeNewUser?: boolean) => Promise<IValidateOtpRo>;
	};
}

export function useOtp(): IOtpHookReturn {
	const { checkUserExistence } = useUsers().actions;

	async function requestOtp(dto: UpsertOtpDto, shouldBeNewUser?: boolean): Promise<IUpsertOtpRo> {
		if (shouldBeNewUser !== undefined) {
			const isUserExist = await checkUserExistence(dto);
			if (shouldBeNewUser && isUserExist) {
				throw new Exception('User with this email already exists');
			}
			if (!shouldBeNewUser && !isUserExist) {
				throw new Exception('User with this email does not exist');
			}
		}

		return api.post<UpsertOtpDto, IUpsertOtpRo>(OTP_URLS.upsert, dto);
	}

	function validateOtp(dto: ValidateOtpDto): Promise<IValidateOtpRo> {
		return api.post<ValidateOtpDto, IValidateOtpRo>(OTP_URLS.validate, dto);
	}

	return { actions: { requestOtp, validateOtp } };
}
