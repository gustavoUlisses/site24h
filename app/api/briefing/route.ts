import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const dataStr = formData.get('data') as string;
    const data = JSON.parse(dataStr);
    
    // In a real Vercel app, you would upload these files to S3/Cloudinary
    // Here we just acknowledge them to avoid breaking the flow
    const files: any[] = [];
    
    // Iterate through all entries to find files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push({
          fieldname: key,
          filename: value.name,
          originalname: value.name,
          url: `https://via.placeholder.com/150?text=${encodeURIComponent(value.name)}` // Mock URL for now
        });
      }
    }

    const newBriefing = {
      id: Date.now().toString(),
      ...data,
      files: files,
      status: 'a pagar',
      createdAt: new Date().toISOString(),
    };

    db.briefings.push(newBriefing);
    
    return NextResponse.json({ success: true, id: newBriefing.id });
  } catch (error) {
    console.error('Briefing error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao processar briefing' },
      { status: 500 }
    );
  }
}
