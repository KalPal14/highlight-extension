import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
	const alex = await prisma.user.upsert({
		where: { email: 'alex@test.com' },
		update: {},
		create: {
			email: 'alex@test.com',
			name: 'Alex',
		},
	});
	const bob = await prisma.user.upsert({
		where: { email: 'bob@test.com' },
		update: {},
		create: {
			email: 'bob@test.com',
			name: 'Bob',
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
