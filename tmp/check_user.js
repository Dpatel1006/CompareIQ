const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'vadariyadvarakesh@gmail.com' },
        });
        console.log(JSON.stringify(user, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
