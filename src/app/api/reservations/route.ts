import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { courtId, date, startHour, playerName, playerPhone, playerEmail } = body

  if (!courtId || !date || startHour === undefined || !playerName || !playerPhone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate hour range
  if (startHour < 7 || startHour > 20) {
    return NextResponse.json({ error: 'Invalid hour' }, { status: 400 })
  }

  // Check for existing reservation (race-condition guard)
  const existing = await prisma.reservation.findFirst({
    where: { courtId, date, startHour },
  })
  if (existing) {
    return NextResponse.json({ error: 'Court already reserved for this time' }, { status: 409 })
  }

  const reservation = await prisma.reservation.create({
    data: {
      courtId,
      date,
      startHour,
      playerName,
      playerPhone,
      playerEmail: playerEmail ?? null,
    },
  })

  return NextResponse.json({ reservation }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  const where = date ? { date } : {}

  const reservations = await prisma.reservation.findMany({
    where,
    include: { court: true },
    orderBy: [{ date: 'asc' }, { startHour: 'asc' }],
  })

  return NextResponse.json({ reservations })
}
