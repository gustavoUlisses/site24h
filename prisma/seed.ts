import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Initial Settings
  await prisma.setting.upsert({
    where: { key: 'affiliateLink' },
    update: {},
    create: {
      key: 'affiliateLink',
      value: 'https://www.hostgator.com.br/afiliados',
    },
  });

  // Initial Portfolio
  const portfolioItems = [
    {
      title: 'E-commerce de Moda',
      category: 'Web Design',
      image: 'https://picsum.photos/seed/shop/800/600',
      description: 'Plataforma completa com checkout e gestão de estoque.',
    },
    {
      title: 'App de Delivery',
      category: 'UI/UX',
      image: 'https://picsum.photos/seed/app/800/600',
      description: 'Interface intuitiva focada na experiência do usuário.',
    },
    {
      title: 'Identidade Visual - Tech',
      category: 'Branding',
      image: 'https://picsum.photos/seed/brand/800/600',
      description: 'Criação de logo e manual da marca para startup.',
    },
  ];

  for (const item of portfolioItems) {
    await prisma.portfolioItem.create({
      data: item,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
