import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

import { USER_SPEC } from '../src/common/constants/spec/users';

const prisma = new PrismaClient();
const salt = Number(process.env.SALT);

async function main(): Promise<void> {
	const alex = await prisma.userModel.upsert({
		where: { email: USER_SPEC.email },
		update: {},
		create: {
			email: USER_SPEC.email,
			username: USER_SPEC.username,
			password: await hash(USER_SPEC.password, salt),
		},
	});
	const bob = await prisma.userModel.upsert({
		where: { email: 'bob@test.com' },
		update: {},
		create: {
			email: 'bob@test.com',
			username: 'bob_test',
			password: await hash('123123', salt),
		},
	});
	console.log({ alex, bob });
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
