import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function verifyAdmin() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const secret = process.env.JWT_SECRET || 'super-secret-key-for-gus-dev-2026';
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}
