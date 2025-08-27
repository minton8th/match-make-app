import React from 'react'

export default function MobileGenerateButtons({ 
  members, 
  handleGenerateMatches, 
  generatedMatches, 
  clearResults 
}) {
  return (
    <div className="generate-buttons-fixed">
      <button
        disabled={members.length < 4}
        onClick={() => handleGenerateMatches(false)}
        className="btn btn-secondary"
      >
        通常の組み合わせを生成
      </button>
      
      <button
        disabled={members.length < 4}
        onClick={() => handleGenerateMatches(true)}
        className="btn btn-primary"
      >
        レベル別組み合わせを生成
      </button>
      
      {generatedMatches && (
        <button
          onClick={clearResults}
          className="btn btn-danger"
        >
          結果をクリア
        </button>
      )}
    </div>
  )
}
