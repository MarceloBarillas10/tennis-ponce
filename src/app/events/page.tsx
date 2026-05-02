'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import TournamentBracket from '@/components/TournamentBracket'
import { Trophy, Calendar, MapPin, Users, Activity, Loader2 } from 'lucide-react'

const HERO_IMG = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=80&fit=crop'

interface Match {
  id: number
  round: number
  position: number
  player1: string | null
  player2: string | null
  score1: number | null
  score2: number | null
  status: string
  court?: { id: number; name: string } | null
}

interface EventCourt {
  id: number
  court: { id: number; name: string }
}

interface Event {
  id: number
  name: string
  description: string | null
  startDate: string
  endDate: string
  status: string
  eventCourts: EventCourt[]
  matches: Match[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
      LIVE
    </span>
  )
  if (status === 'upcoming') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
      UPCOMING
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">
      COMPLETED
    </span>
  )
}

function ActiveEventDetail({ event }: { event: Event }) {
  const activeMatches = event.matches.filter((m) => m.status === 'active')
  const completedMatches = event.matches.filter((m) => m.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Live matches */}
      {activeMatches.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <Activity size={16} className="text-gold-400" />
            Live Matches
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeMatches.map((match) => (
              <div key={match.id} className="bg-navy-900 border border-gold-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  <span className="text-gold-400 text-xs font-bold">
                    IN PROGRESS {match.court ? `· ${match.court.name}` : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{match.player1 ?? 'TBD'}</span>
                    <span className="text-gray-400 text-sm">{match.score1 ?? '–'}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{match.player2 ?? 'TBD'}</span>
                    <span className="text-gray-400 text-sm">{match.score2 ?? '–'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reserved courts */}
      {event.eventCourts.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-blue-400" />
            Courts Reserved for Tournament
          </h3>
          <div className="flex flex-wrap gap-2">
            {event.eventCourts.map((ec) => (
              <span key={ec.id} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium rounded-lg">
                {ec.court.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Completed results */}
      {completedMatches.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <Users size={16} className="text-emerald-400" />
            Completed Results
          </h3>
          <div className="space-y-2">
            {completedMatches.map((match) => {
              const winner = match.score1 !== null && match.score2 !== null
                ? match.score1 > match.score2 ? match.player1 : match.player2
                : null
              return (
                <div key={match.id} className="bg-navy-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className={winner === match.player1 ? 'text-white font-bold' : 'text-gray-400'}>
                      {match.player1}
                    </span>
                    <span className="text-gray-600 mx-2">vs</span>
                    <span className={winner === match.player2 ? 'text-white font-bold' : 'text-gray-400'}>
                      {match.player2}
                    </span>
                  </div>
                  <div className="text-sm font-black">
                    <span className={winner === match.player1 ? 'text-gold-400' : 'text-gray-500'}>{match.score1}</span>
                    <span className="text-gray-600 mx-1">–</span>
                    <span className={winner === match.player2 ? 'text-gold-400' : 'text-gray-500'}>{match.score2}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bracket */}
      {event.matches.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-gold-400" />
            Tournament Bracket
          </h3>
          <div className="bg-navy-900 border border-white/10 rounded-2xl p-6">
            <TournamentBracket matches={event.matches} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'active' | 'upcoming'>('active')
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? [])
        // Auto-expand first active event
        const first = (data.events ?? []).find((e: Event) => e.status === 'active')
        if (first) setExpandedEvent(first.id)
      })
      .finally(() => setLoading(false))
  }, [])

  const activeEvents = events.filter((e) => e.status === 'active')
  const upcomingEvents = events.filter((e) => e.status === 'upcoming')

  return (
    <div className="min-h-screen bg-navy-900 pt-16">
      {/* Header with photo banner */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Tennis court"
            fill
            className="object-cover object-[center_30%] brightness-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/50" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-14">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Compete</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Events & Tournaments</h1>
          <p className="text-gray-300 text-lg">Live brackets, upcoming competitions, and results</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-navy-800 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setTab('active')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === 'active'
                ? 'bg-gold-500 text-navy-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Current Events
            {activeEvents.length > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${tab === 'active' ? 'bg-navy-900/30 text-navy-900' : 'bg-gold-500/20 text-gold-400'}`}>
                {activeEvents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('upcoming')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === 'upcoming'
                ? 'bg-gold-500 text-navy-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
            {upcomingEvents.length > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${tab === 'upcoming' ? 'bg-navy-900/30 text-navy-900' : 'bg-blue-500/20 text-blue-400'}`}>
                {upcomingEvents.length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 py-16 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span>Loading events...</span>
          </div>
        ) : (
          <div className="space-y-5">
            {tab === 'active' && (
              activeEvents.length === 0 ? (
                <div className="text-center py-16 text-gray-600">
                  <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No active events right now.</p>
                </div>
              ) : (
                activeEvents.map((event) => (
                  <div key={event.id} className="bg-navy-800 border border-white/10 rounded-2xl overflow-hidden">
                    {/* Event header */}
                    <button
                      className="w-full text-left p-6 hover:bg-navy-700/30 transition-colors"
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={event.status} />
                          </div>
                          <h2 className="text-xl font-black text-white mb-1">{event.name}</h2>
                          {event.description && (
                            <p className="text-gray-400 text-sm">{event.description}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <Calendar size={14} />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          {event.startDate !== event.endDate && (
                            <div className="text-gray-600 text-xs mt-1">– {formatDate(event.endDate)}</div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {expandedEvent === event.id && (
                      <div className="border-t border-white/10 p-6">
                        <ActiveEventDetail event={event} />
                      </div>
                    )}
                  </div>
                ))
              )
            )}

            {tab === 'upcoming' && (
              upcomingEvents.length === 0 ? (
                <div className="text-center py-16 text-gray-600">
                  <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No upcoming events scheduled.</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-navy-800 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2">
                          <StatusBadge status={event.status} />
                        </div>
                        <h2 className="text-xl font-black text-white mb-2">{event.name}</h2>
                        {event.description && (
                          <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-gray-300 text-sm font-medium">
                          <Calendar size={14} className="text-blue-400" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        {event.startDate !== event.endDate && (
                          <div className="text-gray-500 text-xs mt-1">– {formatDate(event.endDate)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
