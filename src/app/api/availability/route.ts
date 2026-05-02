import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const TOTAL_COURTS = 8
const ALL_HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7–20

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  if (!date) {
    return NextResponse.json({ error: 'date parameter required' }, { status: 400 })
  }

  const reservations = await prisma.reservation.findMany({
    where: { date },
    select: { startHour: true, courtId: true },
  })

  // Count distinct reserved courts per hour
  const reservedByHour = new Map<number, Set<number>>()
  for (const r of reservations) {
    if (!reservedByHour.has(r.startHour)) {
      reservedByHour.set(r.startHour, new Set())
    }
    reservedByHour.get(r.startHour)!.add(r.courtId)
  }

  // An hour is available if at least one court is free
  const availableHours = ALL_HOURS.filter((hour) => {
    const taken = reservedByHour.get(hour)?.size ?? 0
    return taken < TOTAL_COURTS
  })

  return NextResponse.json({ availableHours })
}
