'use client'

interface Court {
  id: number
  name: string
  position: string
}

interface CourtAvailability {
  court: Court
  available: boolean
}

interface CourtMapOverlayProps {
  courts: CourtAvailability[]
  selectedCourtId?: number | null
  onSelectCourt: (court: Court) => void
}

// Positions pixel-analysed from the 1505×1045 courts-aerial.png image.
// Each entry: [left%, top%, width%, height%]
const POSITIONS: [number, number, number, number][] = [
  // ── Top row (Courts 1, 2, 3) ──────────────────────────────────
  [36.81, 11.48, 10.43, 29.67],   // Court 1
  [52.29, 11.48, 10.43, 29.67],   // Court 2
  [68.04, 11.48, 10.30, 29.57],   // Court 3
  // ── Bottom row (Courts 4, 5, 6, 7, 8) ────────────────────────
  [13.75, 59.81, 10.50, 30.43],   // Court 4
  [28.84, 59.81, 10.43, 30.43],   // Court 5
  [43.79, 59.81, 10.30, 30.43],   // Court 6
  [58.80, 59.81, 10.43, 30.43],   // Court 7
  [74.15, 59.81, 10.50, 30.43],   // Court 8
]

export default function CourtMapOverlay({ courts, selectedCourtId, onSelectCourt }: CourtMapOverlayProps) {
  // Sort all courts by position (top first) then by id, so index maps to POSITIONS
  const sorted = [...courts].sort((a, b) => {
    if (a.court.position !== b.court.position) {
      return a.court.position === 'top' ? -1 : 1
    }
    return a.court.id - b.court.id
  })

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none shadow-2xl"
      style={{ aspectRatio: '1505 / 1045' }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/courts-aerial.png"
        alt="Tennis courts aerial view"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Court overlay buttons */}
      {sorted.map((ca, idx) => {
        const pos = POSITIONS[idx]
        if (!pos) return null

        const [left, top, width, height] = pos
        const isSelected = ca.court.id === selectedCourtId
        const isAvailable = ca.available
        const courtNum = idx + 1

        return (
          <button
            key={ca.court.id}
            disabled={!isAvailable}
            onClick={isAvailable ? () => onSelectCourt(ca.court) : undefined}
            aria-label={`${ca.court.name} – ${isAvailable ? 'available' : 'reserved'}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
            className={`
              rounded-xl border-2 transition-all duration-150 flex flex-col items-center justify-center gap-[6%]
              ${isAvailable
                ? isSelected
                  ? 'bg-gold-500/75 border-gold-300 shadow-lg shadow-gold-500/40 scale-[1.02] cursor-pointer'
                  : 'bg-white/15 border-white/50 hover:bg-white/25 hover:border-white/80 hover:scale-[1.02] cursor-pointer backdrop-blur-[2px]'
                : 'bg-gray-900/55 border-gray-600/40 cursor-not-allowed'
              }
            `}
          >
            {/* "Court" label */}
            <span
              className={`font-bold uppercase tracking-widest leading-none
                ${isSelected ? 'text-navy-900' : isAvailable ? 'text-white/90' : 'text-gray-500'}
              `}
              style={{ fontSize: 'clamp(7px, 1.2vw, 13px)' }}
            >
              Court
            </span>

            {/* Court number */}
            <span
              className={`font-black leading-none drop-shadow-lg
                ${isSelected ? 'text-navy-900' : isAvailable ? 'text-white' : 'text-gray-500'}
              `}
              style={{ fontSize: 'clamp(18px, 3.5vw, 52px)' }}
            >
              {courtNum}
            </span>

            {/* Status chip */}
            <span
              className={`font-bold uppercase tracking-wider leading-none px-[8%] py-[4%] rounded-full
                ${isSelected
                  ? 'bg-navy-900/30 text-navy-900'
                  : isAvailable
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/20 text-red-400'
                }
              `}
              style={{ fontSize: 'clamp(6px, 1vw, 11px)' }}
            >
              {isSelected ? 'Selected' : isAvailable ? 'Open' : 'Reserved'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
