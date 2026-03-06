import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();
    
    await prisma.briefing.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update briefing error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
