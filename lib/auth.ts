import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from './db';

export async function verifyAdmin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return null;

  try {
    const data = JSON.parse(Buffer.from(session.value, 'base64').toString());
    if (data.expires < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function createSessionToken(user: { id: string; name: string; email: string; role: string }) {
  const data = {
    ...user,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(data)).toString('base64');
}
