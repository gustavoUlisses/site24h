import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
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
    
    const briefing = db.briefings.find(b => b.id === id);
    if (briefing) {
      briefing.status = status;
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
