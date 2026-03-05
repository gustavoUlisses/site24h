import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    portfolio: db.portfolio,
    settings: {
      affiliateLink: db.settings.affiliateLink
    }
  });
}
