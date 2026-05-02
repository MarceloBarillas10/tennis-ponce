import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { courtId, date, startHour, playerName, playerPhone, playerEmail } = body

  if (!courtId || !date || startHour === undefined || !playerName || !playerPhone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (startHour < 7 || startHour > 20) {
    return NextResponse.json({ error: 'Invalid hour' }, { status: 400 })
  }

  // Check for existing reservation (race-condition guard)
  const { data: existing } = await supabase
    .from('Reservation')
    .select('id')
    .eq('courtId', courtId)
    .eq('date', date)
    .eq('startHour', startHour)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Court already reserved for this time' }, { status: 409 })
  }

  const { data: reservation, error } = await supabase
    .from('Reservation')
    .insert({
      courtId,
      date,
      startHour,
      playerName,
      playerPhone,
      playerEmail: playerEmail ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reservation }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')

  let query = supabase
    .from('Reservation')
    .select('*, court:Court(*)')
    .order('date', { ascending: true })
    .order('startHour', { ascending: true })

  if (date) query = query.eq('date', date)

  const { data: reservations, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reservations })
}
