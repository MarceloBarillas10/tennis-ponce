import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      eventCourts: { include: { court: true } },
      matches: { include: { court: true }, orderBy: [{ round: 'asc' }, { position: 'asc' }] },
    },
    orderBy: { startDate: 'asc' },
  })

  return NextResponse.json({ events })
}
