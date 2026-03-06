import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const portfolio = await prisma.portfolioItem.findMany();
  const affiliateSetting = await prisma.setting.findUnique({
    where: { key: 'affiliateLink' }
  });

  return NextResponse.json({
    portfolio,
    settings: {
      affiliateLink: affiliateSetting?.value || 'https://www.hostgator.com.br/afiliados'
    }
  });
}
