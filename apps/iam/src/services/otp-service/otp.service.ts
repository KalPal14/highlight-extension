import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { HttpException } from '~libs/common';
import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { IValidateOtpRo } from '~libs/ro/iam';
import { MailerService } from '~libs/express-core';

import { TYPES } from '~/iam/common/constants/types';
import { IOtpRepository } from '~/iam/repositories/otp-repository/otp.repository.interface';
import { IOtpFactory } from '~/iam/domain/otp/factory/otp.factory.interface';
import { OtpModel } from '~/iam/prisma/client';

import { IOtpService } from './otp.service.interface';

@injectable()
export class OtpService implements IOtpService {
	constructor(
		@inject(TYPES.OtpRepository) private otpRepository: IOtpRepository,
		@inject(TYPES.OtpFactory) private otpFactory: IOtpFactory,
		@inject(TYPES.MailerService) private mailerService: MailerService
	) {}

	async upsert({ email }: UpsertOtpDto): Promise<{ otp: OtpModel; testMailUrl: string | null }> {
		const otp = this.otpFactory.create({ email });
		const testMailUrl = await this.mailerService.sendMail({
			to: email,
			subject: 'Email Verification Code',
			text: `Your Email Verification Code is: ${otp.code}`,
			html: `<p>Your Email Verification Code is: <h1>${otp.code}</h1></p>`,
		});
		const otpEntity = await this.otpRepository.upsert(otp);
		return { otp: otpEntity, testMailUrl };
	}

	async validate({ email, code }: ValidateOtpDto): Promise<IValidateOtpRo> {
		const existingOtp = await this.otpRepository.findBy({ email });
		if (!existingOtp) {
			throw new HttpException(404, `One-time password for ${email} does not exist`);
		}

		const isValid = this.otpFactory
			.create({ email, code: +code })
			.compereOtp(existingOtp.code, existingOtp.updatedAt);
		if (!isValid) {
			throw new HttpException(400, 'One-time password is incorrect or outdated');
		}
		return { success: true };
	}
}
