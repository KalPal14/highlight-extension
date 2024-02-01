import { PrismaClient } from '@prisma/client';

import { usersSeed } from './users.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
	usersSeed(prisma);
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
