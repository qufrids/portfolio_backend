import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const isMobile = /mobile/i.test(userAgent);
    let browser = 'other';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Safari')) browser = 'safari';
    else if (userAgent.includes('Edge')) browser = 'edge';

    await prisma.pageView.create({
      data: {
        path: body.path || '/',
        title: body.title,
        referrer: body.referrer,
        visitorId: body.visitorId,
        ipAddress: ip,
        userAgent: userAgent,
        device: isMobile ? 'mobile' : 'desktop',
        browser,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const [totalViews, recentViews, topPages] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: startDate } } }),
      prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      totalViews,
      recentViews,
      topPages: topPages.map(p => ({ path: p.path, views: p._count.path })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
