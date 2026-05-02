'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import CourtMapOverlay from '@/components/CourtMapOverlay'
import { ChevronLeft, ChevronRight, X, CheckCircle, Loader2, CalendarDays, Clock } from 'lucide-react'

const AERIAL_IMG = 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1400'

interface Court {
  id: number
  name: string
  description?: string | null
  position: string
}

interface CourtAvailability {
  court: Court
  available: boolean
}

function formatHour(hour: number): string {
  if (hour === 12) return '12:00 PM'
  if (hour < 12) return `${hour}:00 AM`
  return `${hour - 12}:00 PM`
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function isSunday(date: Date): boolean {
  return date.getDay() === 0
}

// Navigate weeks
function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Get the Mon–Sat of a given week
function getWeekDays(anchor: Date): Date[] {
  const monday = new Date(anchor)
  const day = anchor.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)
  return Array.from({ length: 6 }, (_, i) => addDays(monday, i))
}

export default function ReservationsPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [anchor, setAnchor] = useState(today)
  const [selectedDate, setSelectedDate] = useState<string>(toDateString(today))
  const [availableHours, setAvailableHours] = useState<number[]>([])
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [courts, setCourts] = useState<CourtAvailability[]>([])
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [loadingHours, setLoadingHours] = useState(false)
  const [loadingCourts, setLoadingCourts] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitting, setSubmitting] = useState(false)

  const weekDays = getWeekDays(anchor)

  // Load available hours when date changes
  const loadHours = useCallback(async (date: string) => {
    setLoadingHours(true)
    setSelectedHour(null)
    setCourts([])
    setSelectedCourt(null)
    try {
      const res = await fetch(`/api/availability?date=${date}`)
      const data = await res.json()
      setAvailableHours(data.availableHours ?? [])
    } finally {
      setLoadingHours(false)
    }
  }, [])

  // Load court availability when hour is selected
  const loadCourts = useCallback(async (date: string, hour: number) => {
    setLoadingCourts(true)
    setSelectedCourt(null)
    try {
      const res = await fetch(`/api/courts?date=${date}&hour=${hour}`)
      const data = await res.json()
      setCourts(data.courts ?? [])
    } finally {
      setLoadingCourts(false)
    }
  }, [])

  useEffect(() => {
    loadHours(selectedDate)
  }, [selectedDate, loadHours])

  function selectHour(hour: number) {
    setSelectedHour(hour)
    loadCourts(selectedDate, hour)
  }

  async function submitReservation() {
    if (!selectedCourt || selectedHour === null || !form.name || !form.phone) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courtId: selectedCourt.id,
          date: selectedDate,
          startHour: selectedHour,
          playerName: form.name,
          playerPhone: form.phone,
          playerEmail: form.email || undefined,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setShowModal(false)
        setSelectedCourt(null)
        setSelectedHour(null)
        setCourts([])
        setForm({ name: '', phone: '', email: '' })
        loadHours(selectedDate)
        setTimeout(() => setSuccess(false), 5000)
      }
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen bg-navy-900 pt-16">
      {/* Header with aerial court photo */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={AERIAL_IMG}
            alt="Tennis court aerial view"
            fill
            className="object-cover object-center brightness-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/40" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-14">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Book a Court</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Reservations</h1>
          <p className="text-gray-300 text-lg">Select your date and time to see available courts</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300">
            <CheckCircle size={20} />
            <span className="font-medium">Reservation confirmed! See you on the court.</span>
          </div>
        )}

        {/* Step 1 – Date */}
        <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-full bg-gold-500 text-navy-900 font-black text-sm flex items-center justify-center">1</div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <CalendarDays size={18} className="text-gold-400" />
              Select a Date
            </h2>
          </div>

          {/* Week navigator */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setAnchor(addDays(anchor, -7))}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-gray-400 text-sm flex-1 text-center">
              {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setAnchor(addDays(anchor, 7))}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {weekDays.map((date, i) => {
              const dateStr = toDateString(date)
              const isPast = date < today
              const isSelected = dateStr === selectedDate
              return (
                <button
                  key={dateStr}
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`rounded-xl p-3 text-center transition-all
                    ${isSelected
                      ? 'bg-gold-500 text-navy-900 font-bold'
                      : isPast
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                    }
                  `}
                >
                  <div className="text-xs font-medium mb-1">{WEEKDAYS[i]}</div>
                  <div className="text-lg font-black">{date.getDate()}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2 – Time */}
        <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-7 h-7 rounded-full font-black text-sm flex items-center justify-center ${selectedDate ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-gray-500'}`}>2</div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Clock size={18} className="text-gold-400" />
              Select a Time
            </h2>
          </div>

          {loadingHours ? (
            <div className="flex items-center gap-2 text-gray-500 py-4">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading availability...</span>
            </div>
          ) : availableHours.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No time slots available for this date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableHours.map((hour) => (
                <button
                  key={hour}
                  onClick={() => selectHour(hour)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${selectedHour === hour
                      ? 'bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/20'
                      : 'bg-navy-700 text-gray-300 hover:bg-navy-600 hover:text-white'
                    }
                  `}
                >
                  {formatHour(hour)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 3 – Court map */}
        {selectedHour !== null && (
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-gold-500 text-navy-900 font-black text-sm flex items-center justify-center">3</div>
              <h2 className="text-white font-bold text-lg">Select a Court</h2>
              <span className="text-sm text-gray-400 ml-auto">
                {formatHour(selectedHour)} · {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {loadingCourts ? (
              <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Loading courts...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <CourtMapOverlay
                  courts={courts}
                  selectedCourtId={selectedCourt?.id ?? null}
                  onSelectCourt={(court) => { setSelectedCourt(court); setShowModal(true) }}
                />
                <p className="text-xs text-gray-600">Tap an available court to reserve it</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedCourt && selectedHour !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-navy-800 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-bold text-xl">Confirm Reservation</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedCourt.name} · {formatHour(selectedHour)} · {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => { setShowModal(false); setSelectedCourt(null) }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-navy-900 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="787-555-0000"
                  className="w-full bg-navy-900 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-navy-900 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <button
                onClick={submitReservation}
                disabled={!form.name || !form.phone || submitting}
                className="w-full mt-2 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                Reserve {selectedCourt.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
