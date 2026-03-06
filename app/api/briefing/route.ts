import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const dataStr = formData.get('data') as string;
    const data = JSON.parse(dataStr);
    
    const files: any[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push({
          fieldname: key,
          filename: value.name,
          url: `https://via.placeholder.com/150?text=${encodeURIComponent(value.name)}`
        });
      }
    }

    const newBriefing = await prisma.briefing.create({
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        projectType: data.projectType,
        description: data.description,
        budget: data.budget,
        timeline: data.timeline,
        assets: JSON.stringify(files),
        status: 'pending',
      },
    });
    
    return NextResponse.json({ success: true, id: newBriefing.id });
  } catch (error) {
    console.error('Briefing error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao processar briefing' },
      { status: 500 }
    );
  }
}
