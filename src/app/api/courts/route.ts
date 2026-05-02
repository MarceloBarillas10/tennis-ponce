import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

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

  const [{ data: allCourts, error: courtsError }, { data: reservations, error: resError }] =
    await Promise.all([
      supabase.from('Court').select('*').order('id', { ascending: true }),
      supabase.from('Reservation').select('courtId').eq('date', date).eq('startHour', hour),
    ])

  if (courtsError) return NextResponse.json({ error: courtsError.message }, { status: 500 })
  if (resError) return NextResponse.json({ error: resError.message }, { status: 500 })

  const reservedIds = new Set((reservations ?? []).map((r) => r.courtId))

  const courts = (allCourts ?? []).map((court) => ({
    court,
    available: !reservedIds.has(court.id),
  }))

  return NextResponse.json({ courts })
}
