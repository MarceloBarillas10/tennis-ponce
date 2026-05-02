import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.match.deleteMany()
  await prisma.eventCourt.deleteMany()
  await prisma.event.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.court.deleteMany()

  // Create 8 courts: 3 top (Courts 1-3), 5 bottom (Courts 4-8)
  const courtData = [
    { name: 'Court 1', position: 'top', description: 'Professional hard court' },
    { name: 'Court 2', position: 'top', description: 'Professional hard court' },
    { name: 'Court 3', position: 'top', description: 'Professional hard court' },
    { name: 'Court 4', position: 'bottom', description: 'Professional hard court' },
    { name: 'Court 5', position: 'bottom', description: 'Professional hard court' },
    { name: 'Court 6', position: 'bottom', description: 'Professional hard court' },
    { name: 'Court 7', position: 'bottom', description: 'Professional hard court' },
    { name: 'Court 8', position: 'bottom', description: 'Professional hard court' },
  ]
  const courts = []
  for (const data of courtData) {
    courts.push(await prisma.court.create({ data }))
  }

  // Today's date
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  // Sample reservations for today
  await prisma.reservation.createMany({
    data: [
      { courtId: courts[0].id, date: todayStr, startHour: 9, playerName: 'Carlos Rodríguez', playerPhone: '787-555-0101' },
      { courtId: courts[0].id, date: todayStr, startHour: 10, playerName: 'Carlos Rodríguez', playerPhone: '787-555-0101' },
      { courtId: courts[1].id, date: todayStr, startHour: 9, playerName: 'Juan García', playerPhone: '787-555-0202' },
      { courtId: courts[2].id, date: todayStr, startHour: 11, playerName: 'Roberto Díaz', playerPhone: '787-555-0303' },
      { courtId: courts[3].id, date: todayStr, startHour: 14, playerName: 'Luis Martínez', playerPhone: '787-555-0404' },
      { courtId: courts[4].id, date: todayStr, startHour: 14, playerName: 'Alberto Vega', playerPhone: '787-555-0505' },
      { courtId: courts[0].id, date: todayStr, startHour: 14, playerName: 'Ponce Open', playerPhone: 'Tournament' },
      { courtId: courts[1].id, date: todayStr, startHour: 14, playerName: 'Ponce Open', playerPhone: 'Tournament' },
      // Reserve all 8 courts at 8am
      { courtId: courts[0].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
      { courtId: courts[1].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
      { courtId: courts[2].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
      { courtId: courts[3].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
      { courtId: courts[4].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
      { courtId: courts[5].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
      { courtId: courts[6].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
      { courtId: courts[7].id, date: todayStr, startHour: 8, playerName: 'Morning Clinic', playerPhone: '787-555-9999' },
    ],
  })

  // Active tournament: Ponce Open 2026
  const ponceOpen = await prisma.event.create({
    data: {
      name: 'Ponce Open 2026',
      description: 'Annual tennis championship in Ponce, Puerto Rico. Single elimination format with 8 of the island\'s top players competing for the title.',
      startDate: todayStr,
      endDate: tomorrowStr,
      status: 'active',
    },
  })

  // Courts used by the tournament
  await prisma.eventCourt.createMany({
    data: [
      { eventId: ponceOpen.id, courtId: courts[0].id },
      { eventId: ponceOpen.id, courtId: courts[1].id },
      { eventId: ponceOpen.id, courtId: courts[4].id },
    ],
  })

  // Matches
  await prisma.match.createMany({
    data: [
      // Round 1 - Quarterfinals
      { eventId: ponceOpen.id, courtId: null, round: 1, position: 1, player1: 'Carlos Rodríguez', player2: 'Miguel Santos', score1: 6, score2: 4, status: 'completed' },
      { eventId: ponceOpen.id, courtId: null, round: 1, position: 2, player1: 'Juan García', player2: 'Roberto Díaz', score1: 6, score2: 2, status: 'completed' },
      { eventId: ponceOpen.id, courtId: null, round: 1, position: 3, player1: 'Luis Martínez', player2: 'Alberto Vega', score1: 7, score2: 6, status: 'completed' },
      { eventId: ponceOpen.id, courtId: courts[4].id, round: 1, position: 4, player1: 'Eduardo Torres', player2: 'Fernando López', score1: null, score2: null, status: 'active' },
      // Round 2 - Semifinals
      { eventId: ponceOpen.id, courtId: courts[0].id, round: 2, position: 1, player1: 'Carlos Rodríguez', player2: 'Juan García', score1: null, score2: null, status: 'active' },
      { eventId: ponceOpen.id, courtId: null, round: 2, position: 2, player1: 'Luis Martínez', player2: null, score1: null, score2: null, status: 'pending' },
      // Round 3 - Final
      { eventId: ponceOpen.id, courtId: null, round: 3, position: 1, player1: null, player2: null, score1: null, score2: null, status: 'pending' },
    ],
  })

  // Upcoming events
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekStr = nextWeek.toISOString().split('T')[0]
  const nextWeekEnd = new Date(nextWeek)
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 2)
  const nextWeekEndStr = nextWeekEnd.toISOString().split('T')[0]

  await prisma.event.create({
    data: {
      name: 'Doubles Championship',
      description: 'Partner up and compete in this exciting doubles tournament. Teams of 2 battle across all 7 courts in a round-robin format.',
      startDate: nextWeekStr,
      endDate: nextWeekEndStr,
      status: 'upcoming',
    },
  })

  const twoWeeks = new Date(today)
  twoWeeks.setDate(twoWeeks.getDate() + 14)
  const twoWeeksStr = twoWeeks.toISOString().split('T')[0]
  const twoWeeksEnd = new Date(twoWeeks)
  twoWeeksEnd.setDate(twoWeeksEnd.getDate() + 1)
  const twoWeeksEndStr = twoWeeksEnd.toISOString().split('T')[0]

  await prisma.event.create({
    data: {
      name: 'Junior Cup 2026',
      description: 'Youth tournament for players under 18. Categories: U12, U14, U16, and U18. Prizes for all age groups.',
      startDate: twoWeeksStr,
      endDate: twoWeeksEndStr,
      status: 'upcoming',
    },
  })

  console.log('Database seeded successfully!')
  console.log(`- ${courts.length} courts created (3 top, 5 bottom)`)
  console.log('- Sample reservations created')
  console.log('- Ponce Open 2026 (active) created')
  console.log('- 2 upcoming events created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
