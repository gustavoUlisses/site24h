import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'guisdevsp@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'gus@dev2026';

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { email }, 
        process.env.JWT_SECRET || 'super-secret-key-for-gus-dev-2026', 
        { expiresIn: '7d' }
      );
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
