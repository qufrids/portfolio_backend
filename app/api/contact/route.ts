import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (limit.count >= 3) return false;
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const data = contactSchema.parse(body);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const message = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || 'Contact Form',
        message: data.message,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.EMAIL_TO || 'contact@umarzeb.com',
        subject: `New Contact: ${data.subject || 'Portfolio Message'}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#6366f1">New Contact Form Message</h2>
            <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0">
              <p><strong>From:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
            </div>
            <div style="background:#fff;border:1px solid #e5e7eb;padding:20px;border-radius:8px">
              <h3>Message:</h3>
              <p style="white-space:pre-wrap">${data.message}</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
