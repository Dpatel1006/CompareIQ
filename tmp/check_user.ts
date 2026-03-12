import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
        where: { email: 'vadariyadvarakesh@gmail.com' },
    });
    console.log(JSON.stringify(user, null, 2));
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
