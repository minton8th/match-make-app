import React from 'react'

export default function MatchResults({ matches, isLevelBased = false, members }) {
  if (!matches || matches.length === 0) {
    return null
  }

  // メンバーの出場回数を計算
  const playCountStats = calculatePlayCountStats(matches, members)

  return (
    <div className="card">
      <h2>
        {isLevelBased ? 'レベル別組み合わせ結果' : '組み合わせ結果'}
      </h2>
      
      {/* 出場回数統計表示 */}
      <div className="play-stats">
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          出場回数統計
        </h3>
        <div className="stats-grid">
          {playCountStats.map(stat => (
            <div key={stat.memberId} className="stat-item">
              <span className="stat-name">{stat.name}</span>
              <span className="stat-count">{stat.count}回</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y">
        {matches.map(match => (
          <div key={match.matchNumber} className="match-container">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
              第{match.matchNumber}試合
            </h3>
            
            <div className="courts-grid">
              {match.courts.map(court => (
                <div key={court.courtNumber} className="court-card">
                  <div className="court-header">
                    <span className="court-title">コート{court.courtNumber}</span>
                    {isLevelBased && court.level && (
                      <span className="level-badge">
                        {court.level}
                      </span>
                    )}
                  </div>
                  
                  <div className="doubles-court">
                    <div className="pair pair-a">
                      <div className="pair-label">ペアA</div>
                      <div className="pair-players">
                        {[0, 1].map(index => {
                          const player = court.players[index]
                          return (
                            <div key={index} className={`player-slot ${player ? 'occupied' : 'empty'}`}>
                              {player ? (
                                <>
                                  <span className="player-name">{player.name}</span>
                                  <span className="player-level-small">{player.level}</span>
                                </>
                              ) : (
                                <span className="empty-slot">空き</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="vs-divider">VS</div>
                    
                    <div className="pair pair-b">
                      <div className="pair-label">ペアB</div>
                      <div className="pair-players">
                        {[2, 3].map(index => {
                          const player = court.players[index]
                          return (
                            <div key={index} className={`player-slot ${player ? 'occupied' : 'empty'}`}>
                              {player ? (
                                <>
                                  <span className="player-name">{player.name}</span>
                                  <span className="player-level-small">{player.level}</span>
                                </>
                              ) : (
                                <span className="empty-slot">空き</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 出場回数統計を計算
 * @param {Array} matches - 試合データ
 * @param {Array} members - メンバーリスト
 * @returns {Array} 出場回数統計
 */
function calculatePlayCountStats(matches, members) {
  const playCount = {}
  
  // 出場回数を初期化
  members.forEach(member => {
    playCount[member.id] = 0
  })
  
  // 各試合から出場回数をカウント
  matches.forEach(match => {
    match.courts.forEach(court => {
      court.players.forEach(player => {
        if (player && playCount[player.id] !== undefined) {
          playCount[player.id]++
        }
      })
    })
  })
  
  // 統計データを作成
  return members.map(member => ({
    memberId: member.id,
    name: member.name,
    count: playCount[member.id] || 0
  })).sort((a, b) => b.count - a.count) // 出場回数の多い順にソート
}
