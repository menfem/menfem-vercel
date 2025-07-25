import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Check if data already exists
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('Database already has data, skipping seed...');
    return;
  }

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Culture', slug: 'culture', order: 1 } }),
    prisma.category.create({ data: { name: 'Style', slug: 'style', order: 2 } }),
    prisma.category.create({ data: { name: 'Health', slug: 'health', order: 3 } }),
    prisma.category.create({ data: { name: 'Tech', slug: 'tech', order: 4 } }),
    prisma.category.create({ data: { name: 'Finance', slug: 'finance', order: 5 } }),
    prisma.category.create({ data: { name: 'Personal Development', slug: 'personal-development', order: 6 } }),
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Feminism', slug: 'feminism' } }),
    prisma.tag.create({ data: { name: 'Masculinity', slug: 'masculinity' } }),
    prisma.tag.create({ data: { name: 'Relationships', slug: 'relationships' } }),
    prisma.tag.create({ data: { name: 'Career', slug: 'career' } }),
    prisma.tag.create({ data: { name: 'Mental Health', slug: 'mental-health' } }),
  ]);

  // Create test users
  const { hash } = await import('@node-rs/argon2');
  const passwordHash = await hash('password123', {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  
  const { generateId } = await import('lucia');
  
  const adminUser = await prisma.user.create({
    data: {
      id: generateId(15),
      email: 'admin@menfem.com',
      username: 'admin',
      passwordHash,
      emailVerified: true,
    },
  });

  const testUser = await prisma.user.create({
    data: {
      id: generateId(15),
      email: 'test@example.com',
      username: 'testuser',
      passwordHash,
      emailVerified: true,
    },
  });

  // Create sample articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Understanding Modern Masculinity',
        slug: 'understanding-modern-masculinity',
        subtitle: 'Exploring what it means to be a man in 2024',
        excerpt: 'A deep dive into the evolving concepts of masculinity in contemporary society.',
        content: 'Full article content here...',
        coverImage: '/images/article-1.jpg',
        isPublished: true,
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryId: categories[0].id,
        readingTime: 8,
      },
    }),
    prisma.article.create({
      data: {
        title: 'The Power of Vulnerability',
        slug: 'power-of-vulnerability',
        subtitle: 'Why opening up is a sign of strength',
        excerpt: 'Challenging traditional notions of emotional expression for men.',
        content: 'Full article content here...',
        coverImage: '/images/article-2.jpg',
        isPublished: true,
        publishedAt: new Date(),
        isPremium: true,
        authorId: adminUser.id,
        categoryId: categories[4].id,
        readingTime: 6,
      },
    }),
  ]);

  // Create article tags
  await prisma.articleTag.createMany({
    data: [
      { articleId: articles[0].id, tagId: tags[1].id },
      { articleId: articles[0].id, tagId: tags[2].id },
      { articleId: articles[1].id, tagId: tags[4].id },
    ],
  });

  // Create sample event
  const event = await prisma.event.create({
    data: {
      title: 'MenFem London Meetup',
      description: 'Join us for our monthly gathering to discuss men\'s issues in a supportive environment.',
      location: 'Central London',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
      capacity: 50,
      isPublished: true,
    },
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });