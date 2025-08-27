// バドミントンの組み合わせを生成するユーティリティ

/**
 * メンバーを均等にコートに配置し、組み合わせを生成する
 * @param {Array} members - メンバーリスト
 * @param {number} courts - コート数
 * @param {number} matches - 試合数
 * @returns {Array} 試合ごとのコート配置
 */
export function generateMatches(members, courts, matches) {
  if (members.length < 4) {
    throw new Error('最低4人のメンバーが必要です')
  }

  const playersPerCourt = 4 // バドミントンは1コート4人
  const totalSlotsPerMatch = courts * playersPerCourt

  const allMatches = []
  const usedPairs = new Set() // 全試合を通してペアの重複を追跡
  const memberPlayCount = {} // 各メンバーの出場回数を記録
  
  // 出場回数を初期化
  members.forEach(member => {
    memberPlayCount[member.id] = 0
  })
  
  for (let matchIndex = 0; matchIndex < matches; matchIndex++) {
    const matchCourts = generateSingleMatchWithRotation(
      members, 
      courts, 
      matchIndex, 
      usedPairs, 
      memberPlayCount,
      totalSlotsPerMatch
    )
    
    allMatches.push({
      matchNumber: matchIndex + 1,
      courts: matchCourts
    })
  }
  
  return allMatches
}

/**
 * ローテーション機能付きの試合コート配置を生成
 * @param {Array} members - 全メンバーリスト
 * @param {number} courts - コート数
 * @param {number} matchIndex - 試合インデックス
 * @param {Set} usedPairs - 既に使用されたペアの記録
 * @param {Object} memberPlayCount - 各メンバーの出場回数
 * @param {number} totalSlotsPerMatch - 1試合あたりの最大出場者数
 * @returns {Array} コート配置
 */
function generateSingleMatchWithRotation(members, courts, matchIndex, usedPairs, memberPlayCount, totalSlotsPerMatch) {
  const playersPerCourt = 4
  const matchCourts = []
  
  // 出場回数が少ないメンバーを優先して選択
  const selectedMembers = selectMembersForMatch(members, memberPlayCount, totalSlotsPerMatch)
  
  let availableMembers = [...selectedMembers]
  
  for (let courtIndex = 0; courtIndex < courts; courtIndex++) {
    if (availableMembers.length >= playersPerCourt) {
      const courtPlayers = selectBestPairCombination(availableMembers, usedPairs)
      
      // 選択されたプレイヤーを利用可能リストから削除
      courtPlayers.forEach(player => {
        const index = availableMembers.findIndex(m => m.id === player.id)
        if (index > -1) availableMembers.splice(index, 1)
        
        // 出場回数を増やす
        if (player) {
          memberPlayCount[player.id]++
        }
      })
      
      // ペアの組み合わせを記録
      recordPairs(courtPlayers, usedPairs)
      
      matchCourts.push({
        courtNumber: courtIndex + 1,
        players: courtPlayers
      })
    } else {
      // 残りのプレイヤーが4人未満の場合
      const courtPlayers = [...availableMembers]
      
      // 出場回数を記録
      courtPlayers.forEach(player => {
        if (player) {
          memberPlayCount[player.id]++
        }
      })
      
      while (courtPlayers.length < playersPerCourt) {
        courtPlayers.push(null)
      }
      availableMembers.length = 0
      
      matchCourts.push({
        courtNumber: courtIndex + 1,
        players: courtPlayers
      })
    }
  }
  
  return matchCourts
}

/**
 * 出場回数に基づいてメンバーを選択（少ない人を優先）
 * @param {Array} allMembers - 全メンバー
 * @param {Object} memberPlayCount - 出場回数記録
 * @param {number} maxSlots - 最大選択数
 * @returns {Array} 選択されたメンバー
 */
function selectMembersForMatch(allMembers, memberPlayCount, maxSlots) {
  // 出場回数順にソート（少ない順）
  const sortedMembers = [...allMembers].sort((a, b) => {
    const countA = memberPlayCount[a.id] || 0
    const countB = memberPlayCount[b.id] || 0
    return countA - countB
  })
  
  // 最大スロット数まで選択
  return sortedMembers.slice(0, maxSlots)
}

/**
 * 1つの試合のコート配置を生成（ペアの重複を最小化）
 * @param {Array} members - メンバーリスト
 * @param {number} courts - コート数
 * @param {number} matchIndex - 試合インデックス
 * @param {Set} usedPairs - 既に使用されたペアの記録
 * @returns {Array} コート配置
 */
function generateSingleMatch(members, courts, matchIndex, usedPairs = new Set()) {
  const playersPerCourt = 4
  const matchCourts = []
  const availableMembers = [...members]
  
  for (let courtIndex = 0; courtIndex < courts; courtIndex++) {
    if (availableMembers.length >= playersPerCourt) {
      const courtPlayers = selectBestPairCombination(availableMembers, usedPairs)
      
      // 選択されたプレイヤーを利用可能リストから削除
      courtPlayers.forEach(player => {
        const index = availableMembers.findIndex(m => m.id === player.id)
        if (index > -1) availableMembers.splice(index, 1)
      })
      
      // ペアの組み合わせを記録
      recordPairs(courtPlayers, usedPairs)
      
      matchCourts.push({
        courtNumber: courtIndex + 1,
        players: courtPlayers
      })
    } else {
      // 残りのプレイヤーが4人未満の場合
      const courtPlayers = [...availableMembers]
      while (courtPlayers.length < playersPerCourt) {
        courtPlayers.push(null)
      }
      availableMembers.length = 0
      
      matchCourts.push({
        courtNumber: courtIndex + 1,
        players: courtPlayers
      })
    }
  }
  
  return matchCourts
}

/**
 * ペアの重複を最小化する最適な4人の組み合わせを選択
 * @param {Array} availableMembers - 利用可能なメンバー
 * @param {Set} usedPairs - 既に使用されたペア
 * @returns {Array} 選択された4人のプレイヤー
 */
function selectBestPairCombination(availableMembers, usedPairs) {
  if (availableMembers.length <= 4) {
    return availableMembers.slice(0, 4)
  }
  
  let bestCombination = null
  let lowestPairCount = Infinity
  
  // 可能な4人の組み合わせを生成（最大100通りまで）
  const combinations = generateCombinations(availableMembers, 4).slice(0, 100)
  
  for (const combination of combinations) {
    const pairCount = countExistingPairs(combination, usedPairs)
    if (pairCount < lowestPairCount) {
      lowestPairCount = pairCount
      bestCombination = combination
      if (pairCount === 0) break // 全て新しいペアなら即座に選択
    }
  }
  
  return bestCombination || availableMembers.slice(0, 4)
}

/**
 * 4人の組み合わせから既存ペア数をカウント
 * @param {Array} players - プレイヤー配列
 * @param {Set} usedPairs - 既に使用されたペア
 * @returns {number} 既存ペア数
 */
function countExistingPairs(players, usedPairs) {
  let count = 0
  // ペアA（0,1）とペアB（2,3）をチェック
  const pairA = getPairKey(players[0], players[1])
  const pairB = getPairKey(players[2], players[3])
  
  if (usedPairs.has(pairA)) count++
  if (usedPairs.has(pairB)) count++
  
  return count
}

/**
 * 4人のプレイヤーからペアを記録
 * @param {Array} players - プレイヤー配列
 * @param {Set} usedPairs - ペア記録用セット
 */
function recordPairs(players, usedPairs) {
  if (players.length >= 4 && players[0] && players[1] && players[2] && players[3]) {
    // ペアA（プレイヤー0,1）とペアB（プレイヤー2,3）を記録
    usedPairs.add(getPairKey(players[0], players[1]))
    usedPairs.add(getPairKey(players[2], players[3]))
  }
}

/**
 * ペアのキーを生成（ID順でソート）
 * @param {Object} player1 - プレイヤー1
 * @param {Object} player2 - プレイヤー2
 * @returns {string} ペアキー
 */
function getPairKey(player1, player2) {
  if (!player1 || !player2) return ''
  const ids = [player1.id, player2.id].sort()
  return `${ids[0]}-${ids[1]}`
}

/**
 * 配列から指定数の組み合わせを生成
 * @param {Array} arr - 元配列
 * @param {number} size - 組み合わせサイズ
 * @returns {Array} 組み合わせ配列
 */
function generateCombinations(arr, size) {
  if (size > arr.length) return []
  if (size === 1) return arr.map(item => [item])
  
  const combinations = []
  
  function combine(start, current) {
    if (current.length === size) {
      combinations.push([...current])
      return
    }
    
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i])
      combine(i + 1, current)
      current.pop()
    }
  }
  
  combine(0, [])
  return combinations
}

/**
 * レベル別の組み合わせを生成
 * @param {Array} members - メンバーリスト
 * @param {number} courts - コート数
 * @param {number} matches - 試合数
 * @returns {Array} レベル別試合配置
 */
export function generateLevelMatches(members, courts, matches) {
  // レベル別にメンバーを分類
  const membersByLevel = {
    '初級': members.filter(m => m.level === '初級'),
    '中級': members.filter(m => m.level === '中級'),
    '上級': members.filter(m => m.level === '上級')
  }
  
  const allMatches = []
  const usedPairsByLevel = {
    '初級': new Set(),
    '中級': new Set(),
    '上級': new Set(),
    '混合': new Set()
  }
  
  // 各レベルの出場回数を記録
  const memberPlayCountByLevel = {
    '初級': {},
    '中級': {},
    '上級': {},
    '混合': {}
  }
  
  // 出場回数を初期化
  members.forEach(member => {
    memberPlayCountByLevel[member.level][member.id] = 0
    memberPlayCountByLevel['混合'][member.id] = 0
  })
  
  for (let matchIndex = 0; matchIndex < matches; matchIndex++) {
    const matchCourts = []
    let courtIndex = 0
    const usedMembersInThisMatch = new Set()
    
    // 各レベルごとにコートを割り当て
    for (const [level, levelMembers] of Object.entries(membersByLevel)) {
      if (levelMembers.length >= 4 && courtIndex < courts) {
        // まだこの試合で使用されていないメンバーのみを対象
        const availableMembers = levelMembers.filter(m => !usedMembersInThisMatch.has(m.id))
        
        if (availableMembers.length >= 4) {
          // 出場回数が少ないメンバーを優先選択
          const selectedMembers = selectMembersForMatch(availableMembers, memberPlayCountByLevel[level], 4)
          const courtPlayers = selectBestPairCombination(selectedMembers, usedPairsByLevel[level])
          
          // 選択されたメンバーを記録
          courtPlayers.forEach(player => {
            if (player) {
              usedMembersInThisMatch.add(player.id)
              memberPlayCountByLevel[level][player.id]++
            }
          })
          
          // ペアを記録
          recordPairs(courtPlayers, usedPairsByLevel[level])
          
          // 4人未満の場合は空きスロットを追加
          while (courtPlayers.length < 4) {
            courtPlayers.push(null)
          }
          
          matchCourts.push({
            courtNumber: courtIndex + 1,
            level: level,
            players: courtPlayers
          })
          
          courtIndex++
        }
      }
    }
    
    // 残りのコートは混合レベルで埋める
    const remainingMembers = members.filter(member => !usedMembersInThisMatch.has(member.id))
    
    if (remainingMembers.length >= 4 && courtIndex < courts) {
      // 混合レベルでも出場回数を考慮
      const selectedMembers = selectMembersForMatch(remainingMembers, memberPlayCountByLevel['混合'], 4)
      const courtPlayers = selectBestPairCombination(selectedMembers, usedPairsByLevel['混合'])
      
      // 出場回数を記録
      courtPlayers.forEach(player => {
        if (player) {
          memberPlayCountByLevel['混合'][player.id]++
        }
      })
      
      recordPairs(courtPlayers, usedPairsByLevel['混合'])
      
      while (courtPlayers.length < 4) {
        courtPlayers.push(null)
      }
      
      matchCourts.push({
        courtNumber: courtIndex + 1,
        level: '混合',
        players: courtPlayers
      })
    }
    
    allMatches.push({
      matchNumber: matchIndex + 1,
      courts: matchCourts
    })
  }
  
  return allMatches
}

/**
 * 同じメンバーが被らないように偏りを持ったシャッフル
 * @param {Array} array - シャッフルする配列
 * @param {number} seed - シード値（試合番号）
 * @returns {Array} シャッフルされた配列
 */
function shuffleWithBias(array, seed = 0) {
  const shuffled = [...array]
  
  // シード値を使った擬似ランダム
  let random = seededRandom(seed)
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * シード値を使った擬似ランダム関数
 * @param {number} seed - シード値
 * @returns {Function} ランダム関数
 */
function seededRandom(seed) {
  let state = seed || 1
  return function() {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}
