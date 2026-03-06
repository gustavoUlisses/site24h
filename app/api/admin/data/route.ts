import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const briefings = await prisma.briefing.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const portfolio = await prisma.portfolioItem.findMany();
  const settingsList = await prisma.setting.findMany();
  
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return NextResponse.json({
    briefings,
    portfolio,
    settings,
  });
}
