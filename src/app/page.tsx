import Link from 'next/link'
import Image from 'next/image'
import { MapPin, CalendarCheck, Trophy, ChevronRight } from 'lucide-react'

const HERO_IMG = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1920&q=85&fit=crop'
const ACTION_IMG = 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=900&q=80&fit=crop'

const features = [
  {
    icon: MapPin,
    title: 'Location',
    subtitle: 'Find Us',
    description: 'Located in the heart of Ponce, Puerto Rico. Easy access with ample parking.',
    href: '/location',
    cta: 'Get Directions',
    color: 'from-emerald-500/20 to-emerald-700/10',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: CalendarCheck,
    title: 'Reservations',
    subtitle: 'Book a Court',
    description: 'Reserve any of our 7 professional courts. Available Mon–Sat, 7:00 AM to 9:00 PM.',
    href: '/reservations',
    cta: 'Reserve Now',
    color: 'from-gold-500/20 to-gold-700/10',
    border: 'border-gold-500/30',
    iconBg: 'bg-gold-500/20',
    iconColor: 'text-gold-400',
    featured: true,
  },
  {
    icon: Trophy,
    title: 'Events',
    subtitle: 'Tournaments',
    description: 'Join official tournaments, track live brackets, and see current standings.',
    href: '/events',
    cta: 'View Events',
    color: 'from-blue-500/20 to-blue-700/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-900">
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
        {/* Real photo background */}
        <Image
          src={HERO_IMG}
          alt="Clay tennis court aerial view"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Layered overlays for readability */}
        <div className="absolute inset-0 bg-navy-900/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 via-transparent to-navy-900/90" />

        {/* Subtle gold center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-gold-500/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/50 bg-black/30 backdrop-blur-sm text-gold-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            Ponce, Puerto Rico
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-2xl">
            Welcome to
          </h1>
          <h1 className="text-5xl sm:text-7xl font-black leading-tight tracking-tight mb-6 drop-shadow-2xl"
              style={{ color: '#c8a951' }}>
            Tennis Ponce
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-16 max-w-xl mx-auto drop-shadow-lg">
            World-class courts. Official tournaments. Your game, elevated.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className={`group relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 backdrop-blur-md bg-black/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50 ${f.featured ? 'ring-1 ring-gold-500/40' : ''}`}
                >
                  {f.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-500 text-navy-900 text-xs font-bold rounded-full whitespace-nowrap">
                      MOST POPULAR
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={f.iconColor} size={20} />
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{f.subtitle}</p>
                  <h2 className="text-xl font-bold text-white mb-2">{f.title}</h2>
                  <p className="text-sm text-gray-300 mb-5 leading-relaxed">{f.description}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-white group-hover:gap-2 transition-all">
                    {f.cta}
                    <ChevronRight size={16} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold-500/50 mx-auto" />
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-navy-800/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '7', label: 'Professional Courts' },
            { value: 'Mon–Sat', label: '7 AM – 9 PM' },
            { value: 'Ponce, PR', label: 'Prime Location' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-black text-gold-400">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COURT SHOWCASE ────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-72 sm:h-96">
          <Image
            src={ACTION_IMG}
            alt="Tennis player in action"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/50 to-navy-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center px-8 sm:px-16 max-w-5xl mx-auto left-0 right-0">
            <div>
              <p className="text-gold-400 text-sm font-bold uppercase tracking-widest mb-2">7 Courts Available</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Professional Hard Courts<br />in the Heart of Ponce
              </h2>
              <Link
                href="/reservations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded-xl transition-colors"
              >
                Book a Court <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
