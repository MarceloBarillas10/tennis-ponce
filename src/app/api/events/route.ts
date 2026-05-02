import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function GET() {
  const { data: events, error } = await supabase
    .from('Event')
    .select(`
      *,
      eventCourts:EventCourt(*, court:Court(*)),
      matches:Match(*, court:Court(*))
    `)
    .order('startDate', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Sort matches by round then position
  const sorted = (events ?? []).map((event) => ({
    ...event,
    matches: [...(event.matches ?? [])].sort(
      (a, b) => a.round - b.round || a.position - b.position
    ),
  }))

  return NextResponse.json({ events: sorted })
}
