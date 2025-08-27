import React, { useState } from 'react'

export default function MemberManager({ members, setMembers }) {
  const [name, setName] = useState('')
  const [level, setLevel] = useState('初級')

  const addMember = () => {
    if (name.trim()) {
      const newMember = {
        id: Date.now(),
        name: name.trim(),
        level
      }
      setMembers([...members, newMember])
      setName('')
      setLevel('初級')
    }
  }

  const removeMember = (id) => {
    setMembers(members.filter(member => member.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMember()
    }
  }

  return (
    <div className="card">
      <h2>メンバー登録</h2>
      
      <div className="mb-6">
        <div className="form-group">
          <label className="form-label">
            名前
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
            placeholder="メンバー名を入力"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            レベル
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="form-select"
          >
            <option value="初級">初級</option>
            <option value="中級">中級</option>
            <option value="上級">上級</option>
          </select>
        </div>
        
        <button
          onClick={addMember}
          disabled={!name.trim()}
          className="btn btn-primary btn-full"
        >
          メンバーを追加
        </button>
      </div>

      <div>
        <h3>
          登録済みメンバー ({members.length}人)
        </h3>
        {members.length === 0 ? (
          <p className="text-muted text-center py-4">まだメンバーが登録されていません</p>
        ) : (
          <div className="member-list">
            {members.map(member => (
              <div key={member.id} className="member-item">
                <span className="member-info">
                  {member.name} 
                  <span className="member-level">
                    {member.level}
                  </span>
                </span>
                <button
                  onClick={() => removeMember(member.id)}
                  className="btn btn-danger"
                  title="削除"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
