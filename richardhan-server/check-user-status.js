const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'dagasa6502@esyline.com';
  console.log(`Checking user and tokens for: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      emailVerifications: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log('User Status:', {
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    status: user.status
  });

  console.log('Verifications (Latest first):', JSON.stringify(user.emailVerifications, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
