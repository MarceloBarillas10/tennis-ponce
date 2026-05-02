'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/location', label: 'Location' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/events', label: 'Events' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 font-black text-sm select-none">
              TP
            </div>
            <span className="text-white font-bold text-lg tracking-wide group-hover:text-gold-400 transition-colors">
              Tennis Ponce
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-gold-400 border-b-2 border-gold-400 pb-0.5'
                    : 'text-gray-300 hover:text-gold-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservations"
              className="ml-4 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm rounded-lg transition-colors"
            >
              Book a Court
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-800 border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-navy-700 text-gold-400'
                    : 'text-gray-300 hover:text-white hover:bg-navy-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservations"
              onClick={() => setOpen(false)}
              className="block mt-3 py-2 px-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm rounded-lg text-center transition-colors"
            >
              Book a Court
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
