import React, { useState } from 'react'
import MemberManager from './components/MemberManager'
import MatchResults from './components/MatchResults'
import MobileGenerateButtons from './components/MobileGenerateButtons'
import { generateMatches, generateLevelMatches } from './utils/matchMaker'
import { useIsMobile } from './hooks/useIsMobile'

function App() {
  const [members, setMembers] = useState([])
  const [courts, setCourts] = useState(1)
  const [matches, setMatches] = useState(1)
  const [generatedMatches, setGeneratedMatches] = useState(null)
  const [isLevelBased, setIsLevelBased] = useState(false)
  const [error, setError] = useState('')
  const isMobile = useIsMobile()

  const handleGenerateMatches = (levelBased = false) => {
    try {
      setError('')
      const result = levelBased 
        ? generateLevelMatches(members, courts, matches)
        : generateMatches(members, courts, matches)
      
      setGeneratedMatches(result)
      setIsLevelBased(levelBased)
    } catch (err) {
      setError(err.message)
      setGeneratedMatches(null)
    }
  }

  const clearResults = () => {
    setGeneratedMatches(null)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="container">
        <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <h1 className="main-title">
            🏸 バドミントンサークル コート割り振りアプリ
          </h1>
          
          <div className="grid grid-2">
            <MemberManager members={members} setMembers={setMembers} />
            
            <div className="space-y">
              {/* コート数設定 */}
              <div className="card">
                <h2>コート設定</h2>
                <div className="form-group">
                  <label className="form-label">
                    利用可能なコート数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={courts}
                    onChange={(e) => setCourts(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-input"
                  />
                </div>
              </div>

              {/* 試合数設定 */}
              <div className="card">
                <h2>試合設定</h2>
                <div className="form-group">
                  <label className="form-label">
                    今日の試合数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={matches}
                    onChange={(e) => setMatches(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-input"
                  />
                </div>
              </div>

              {/* 組み合わせ決定ボタン - デスクトップのみ */}
              {!isMobile && (
                <div className="card">
                  <h2>組み合わせ決定</h2>
                  <div className="space-y">
                    <button
                      disabled={members.length < 4}
                      onClick={() => handleGenerateMatches(false)}
                      className="btn btn-success btn-full"
                    >
                      通常の組み合わせを生成
                    </button>
                    
                    <button
                      disabled={members.length < 4}
                      onClick={() => handleGenerateMatches(true)}
                      className="btn btn-primary btn-full"
                    >
                      レベル別組み合わせを生成
                    </button>
                    
                    {generatedMatches && (
                      <button
                        onClick={clearResults}
                        className="btn btn-danger btn-full"
                      >
                        結果をクリア
                      </button>
                    )}
                  </div>
                  
                  {members.length < 4 && (
                    <p className="text-muted text-center mt-2">
                      ※ 4人以上のメンバーが必要です
                    </p>
                  )}
                  
                  {error && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center', marginTop: '8px' }}>
                      {error}
                    </p>
                  )}
                </div>
              )}
              
              {/* エラーメッセージ - モバイル用 */}
              {isMobile && error && (
                <div className="card">
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>
                    {error}
                  </p>
                </div>
              )}
              
              {/* メンバー不足メッセージ - モバイル用 */}
              {isMobile && members.length < 4 && (
                <div className="card">
                  <p className="text-muted text-center">
                    ※ 4人以上のメンバーが必要です
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* 組み合わせ結果 */}
          {generatedMatches && (
            <div style={{ marginTop: '32px' }}>
              <MatchResults 
                matches={generatedMatches} 
                isLevelBased={isLevelBased} 
                members={members}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* モバイル固定ボタン */}
      {isMobile && (
        <MobileGenerateButtons
          members={members}
          handleGenerateMatches={handleGenerateMatches}
          generatedMatches={generatedMatches}
          clearResults={clearResults}
        />
      )}
    </div>
  )
}

export default App