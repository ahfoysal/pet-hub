const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'ahfoysal30@gmail.com';
  
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { 
        role: 'ADMIN',
        isEmailVerified: true,
        hasProfile: true,
      },
    });
    console.log('✅ User updated to ADMIN:', user.email, user.role);
  } else {
    const hashedPassword = await bcrypt.hash('123456', 10);
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: 'Admin Foysal',
        role: 'ADMIN',
        isEmailVerified: true,
        hasProfile: true,
      },
    });
    console.log('✅ Admin user created:', user.email, user.role);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
