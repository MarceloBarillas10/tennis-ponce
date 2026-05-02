'use client'

interface Match {
  id: number
  round: number
  position: number
  player1: string | null
  player2: string | null
  score1: number | null
  score2: number | null
  status: string
  court?: { name: string } | null
}

interface TournamentBracketProps {
  matches: Match[]
}

function MatchBox({ match }: { match: Match }) {
  const isCompleted = match.status === 'completed'
  const isActive = match.status === 'active'
  const isPending = match.status === 'pending'

  const winner = isCompleted
    ? match.score1 !== null && match.score2 !== null
      ? match.score1 > match.score2 ? 1 : 2
      : null
    : null

  return (
    <div className={`w-52 rounded-xl overflow-hidden border shadow-lg
      ${isActive ? 'border-gold-500/70 shadow-gold-500/10' : 'border-white/10'}
    `}>
      {/* Player 1 */}
      <div className={`flex items-center justify-between px-3 py-2 border-b border-white/10
        ${winner === 1 ? 'bg-navy-600' : 'bg-navy-900'}
      `}>
        <span className={`text-sm truncate max-w-[130px]
          ${isPending && !match.player1 ? 'text-gray-600 italic' : winner === 1 ? 'text-white font-bold' : 'text-gray-300'}
        `}>
          {match.player1 ?? 'TBD'}
        </span>
        {match.score1 !== null && (
          <span className={`text-sm font-black ml-2 min-w-[1.5rem] text-right
            ${winner === 1 ? 'text-gold-400' : 'text-gray-400'}
          `}>
            {match.score1}
          </span>
        )}
      </div>

      {/* Player 2 */}
      <div className={`flex items-center justify-between px-3 py-2
        ${winner === 2 ? 'bg-navy-600' : 'bg-navy-900'}
      `}>
        <span className={`text-sm truncate max-w-[130px]
          ${isPending && !match.player2 ? 'text-gray-600 italic' : winner === 2 ? 'text-white font-bold' : 'text-gray-300'}
        `}>
          {match.player2 ?? 'TBD'}
        </span>
        {match.score2 !== null && (
          <span className={`text-sm font-black ml-2 min-w-[1.5rem] text-right
            ${winner === 2 ? 'text-gold-400' : 'text-gray-400'}
          `}>
            {match.score2}
          </span>
        )}
      </div>

      {/* Status bar */}
      {isActive && (
        <div className="bg-gold-500 px-3 py-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-navy-900 animate-pulse" />
          <span className="text-navy-900 text-xs font-bold">
            LIVE{match.court ? ` · ${match.court.name}` : ''}
          </span>
        </div>
      )}
      {isCompleted && (
        <div className="bg-green-500/20 px-3 py-1">
          <span className="text-green-400 text-xs font-medium">Completed</span>
        </div>
      )}
    </div>
  )
}

export default function TournamentBracket({ matches }: TournamentBracketProps) {
  // Group matches by round
  const rounds = new Map<number, Match[]>()
  for (const match of matches) {
    if (!rounds.has(match.round)) rounds.set(match.round, [])
    rounds.get(match.round)!.push(match)
  }

  const roundNumbers = Array.from(rounds.keys()).sort()
  const maxRound = Math.max(...roundNumbers)

  const roundLabels: Record<number, string> = {}
  if (maxRound === 3) {
    roundLabels[1] = 'Quarterfinals'
    roundLabels[2] = 'Semifinals'
    roundLabels[3] = 'Final'
  } else if (maxRound === 2) {
    roundLabels[1] = 'Semifinals'
    roundLabels[2] = 'Final'
  } else {
    roundLabels[1] = 'Final'
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex items-start gap-0 min-w-max">
        {roundNumbers.map((roundNum, roundIdx) => {
          const roundMatches = rounds.get(roundNum)!.sort((a, b) => a.position - b.position)
          const totalMatchesInRound = roundMatches.length
          // How many QF matches does this round "span"
          const spanFactor = Math.pow(2, roundIdx)

          return (
            <div key={roundNum} className="flex flex-col">
              {/* Round label */}
              <div className="text-center mb-4 px-8">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {roundLabels[roundNum] ?? `Round ${roundNum}`}
                </span>
              </div>

              {/* Matches */}
              <div className="flex flex-col" style={{ gap: `${(spanFactor - 1) * 52 + (spanFactor > 1 ? 32 : 0)}px` }}>
                {roundMatches.map((match, matchIdx) => {
                  // vertical centering
                  const paddingTop = matchIdx === 0 ? `${(spanFactor - 1) * 26}px` : '0'
                  return (
                    <div
                      key={match.id}
                      className="flex items-center"
                      style={{ paddingTop }}
                    >
                      {/* Connector line from previous round */}
                      {roundIdx > 0 && (
                        <div className="flex items-center">
                          <div className="w-8 h-px bg-white/20" />
                        </div>
                      )}

                      <MatchBox match={match} />

                      {/* Connector line to next round */}
                      {roundNum < maxRound && (
                        <div className="flex items-center">
                          <div className="w-8 h-px bg-white/20" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
