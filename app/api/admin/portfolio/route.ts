import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const item = await prisma.portfolioItem.create({
      data: {
        title: body.title,
        category: body.category,
        image: body.image,
        description: body.description,
        link: body.link
      }
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Create portfolio item error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      await prisma.portfolioItem.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error('Delete portfolio item error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
