import Image from 'next/image'
import { MapPin, Clock, Car, Phone, ExternalLink } from 'lucide-react'

const COURTS_IMG = 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1400&q=80&fit=crop'

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-navy-900 pt-16">
      {/* Header with photo banner */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={COURTS_IMG}
            alt="Tennis courts"
            fill
            className="object-cover object-center brightness-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-navy-900/60" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-14">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Find Us</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Location</h1>
          <p className="text-gray-300 text-lg">Professional courts in the heart of Ponce, Puerto Rico</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Map embed - takes 3 cols */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[450px] bg-navy-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1649.9282139795937!2d-66.58645024649545!3d17.998092338583533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2spr!4v1777685366457!5m2!1sen!2spr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tennis Ponce Location"
              />
            </div>

            <a
              href="https://maps.app.goo.gl/TxUsNATT1SXgF1N88"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded-xl transition-colors"
            >
              <ExternalLink size={18} />
              Open in Google Maps
            </a>
          </div>

          {/* Info panel - takes 2 cols */}
          <div className="lg:col-span-2 space-y-5">

            {/* Address */}
            <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">Address</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Tennis Ponce<br />
                    Ponce, Puerto Rico 00716<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="text-gold-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base mb-3">Hours of Operation</h3>
                  <div className="space-y-2">
                    {[
                      { day: 'Monday', hours: '7:00 AM – 9:00 PM' },
                      { day: 'Tuesday', hours: '7:00 AM – 9:00 PM' },
                      { day: 'Wednesday', hours: '7:00 AM – 9:00 PM' },
                      { day: 'Thursday', hours: '7:00 AM – 9:00 PM' },
                      { day: 'Friday', hours: '7:00 AM – 9:00 PM' },
                      { day: 'Saturday', hours: '7:00 AM – 9:00 PM' },
                      { day: 'Sunday', hours: 'Closed' },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-gray-400">{day}</span>
                        <span className={hours === 'Closed' ? 'text-red-400 font-medium' : 'text-white font-medium'}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Parking */}
            <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Car className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">Parking</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Free on-site parking available. Accessible spaces near the main entrance.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="text-purple-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">Contact</h3>
                  <p className="text-gray-300 text-sm">787-555-0100</p>
                  <p className="text-gray-400 text-xs mt-1">For reservations and inquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
