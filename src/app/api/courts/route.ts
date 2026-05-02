import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  const hourParam = request.nextUrl.searchParams.get('hour')

  if (!date || !hourParam) {
    return NextResponse.json({ error: 'date and hour parameters required' }, { status: 400 })
  }

  const hour = parseInt(hourParam, 10)
  if (isNaN(hour) || hour < 7 || hour > 20) {
    return NextResponse.json({ error: 'hour must be between 7 and 20' }, { status: 400 })
  }

  const [allCourts, reservations] = await Promise.all([
    prisma.court.findMany({ orderBy: { id: 'asc' } }),
    prisma.reservation.findMany({
      where: { date, startHour: hour },
      select: { courtId: true },
    }),
  ])

  const reservedIds = new Set(reservations.map((r) => r.courtId))

  const courts = allCourts.map((court) => ({
    court,
    available: !reservedIds.has(court.id),
  }))

  return NextResponse.json({ courts })
}
