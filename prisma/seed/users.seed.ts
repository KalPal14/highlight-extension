import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

import { USER_SPEC } from '../../src/common/constants/spec/users';

const salt = Number(process.env.SALT);

export async function usersSeed(prisma: PrismaClient): Promise<void> {
	const user1 = await prisma.userModel.upsert({
		where: { email: USER_SPEC.email },
		update: {},
		create: {
			email: USER_SPEC.email,
			username: USER_SPEC.username,
			password: await hash(USER_SPEC.password, salt),
		},
	});
	const user2 = await prisma.userModel.upsert({
		where: { email: 'bob@test.com' },
		update: {},
		create: {
			email: 'bob@test.com',
			username: 'bob_test',
			password: await hash('123123', salt),
		},
	});
	console.log({ user1, user2 });
}
