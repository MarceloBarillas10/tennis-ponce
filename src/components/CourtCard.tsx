'use client'

interface Court {
  id: number
  name: string
  description?: string | null
  position: string
}

interface CourtCardProps {
  court: Court
  courtNumber: number   // 1–8
  available: boolean
  selected?: boolean
  onClick?: () => void
}

export default function CourtCard({ court, courtNumber, available, selected, onClick }: CourtCardProps) {
  return (
    <button
      onClick={available && onClick ? onClick : undefined}
      disabled={!available}
      aria-label={`${court.name} – ${available ? 'available' : 'reserved'}`}
      className={`relative w-full rounded-xl overflow-hidden transition-all duration-200 group text-left
        ${available
          ? selected
            ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-navy-900 cursor-pointer scale-[1.04] shadow-2xl shadow-gold-500/30'
            : 'cursor-pointer hover:scale-[1.03] hover:ring-2 hover:ring-white/40 hover:ring-offset-1 hover:ring-offset-navy-900 hover:shadow-xl'
          : 'cursor-not-allowed'
        }
      `}
    >
      {/* Aspect ratio box */}
      <div className="relative w-full" style={{ paddingBottom: '75%' }}>

        {/* Generated aerial court photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/courts-aerial.png"
          alt="Tennis court aerial view"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-300
            ${!available
              ? 'grayscale brightness-40'
              : selected
                ? 'brightness-105'
                : 'brightness-75 group-hover:brightness-90'
            }
          `}
          loading="lazy"
        />

        {/* Bottom gradient for name readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* ── COURT NUMBER – big, centred, always visible ── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-black leading-none select-none drop-shadow-2xl transition-colors
              ${available
                ? selected
                  ? 'text-gold-400'
                  : 'text-white/90 group-hover:text-white'
                : 'text-gray-500'
              }
            `}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
          >
            {courtNumber}
          </span>
        </div>

        {/* Reserved overlay */}
        {!available && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end pb-8 gap-1">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute w-5 h-0.5 bg-red-400 rotate-45" />
              <div className="absolute w-5 h-0.5 bg-red-400 -rotate-45" />
            </div>
          </div>
        )}

        {/* Selected checkmark */}
        {selected && available && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/50">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3.5 3.5 5.5-5.5" stroke="#0a2342" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Available green dot */}
        {available && !selected && (
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/60" />
        )}

        {/* Bottom name bar */}
        <div className="absolute bottom-0 inset-x-0 px-2.5 py-2">
          <p className={`font-bold text-xs tracking-wide ${selected ? 'text-gold-300' : available ? 'text-white/90' : 'text-gray-500'}`}>
            {court.name}
          </p>
          {available && !selected && (
            <p className="text-emerald-400 text-[9px] font-semibold uppercase tracking-widest">Available</p>
          )}
          {selected && (
            <p className="text-gold-400 text-[9px] font-bold uppercase tracking-widest">Selected ✓</p>
          )}
          {!available && (
            <p className="text-red-400/80 text-[9px] font-semibold uppercase tracking-widest">Reserved</p>
          )}
        </div>
      </div>
    </button>
  )
}
