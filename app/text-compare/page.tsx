'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function TextComparePage() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diffResult, setDiffResult] = useState<string | null>(null)

  // 비교 실행 (일단 placeholder)
  const handleCompare = () => {
    setDiffResult('🔍 차이점이 여기에 표시됩니다.')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">🆚 텍스트 비교 도구</h1>
      <p className="text-sm text-muted-foreground mb-6">
        두 개의 텍스트를 입력하고 서로의 차이점을 비교해보세요.
      </p>

      {/* 좌우 입력 영역 */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="font-medium text-sm mb-1 block">기준 텍스트</label>
          <Textarea
            placeholder="기준이 되는 텍스트를 입력하세요"
            className="min-h-[200px] w-full"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="font-medium text-sm mb-1 block">비교 텍스트</label>
          <Textarea
            placeholder="비교할 텍스트를 입력하세요"
            className="min-h-[200px] w-full"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
          />
        </div>
      </div>

      {/* 비교 버튼 */}
      <div className="mb-6">
        <Button onClick={handleCompare}>비교하기</Button>
      </div>

      {/* 결과 영역 */}
      {diffResult && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm">
          {diffResult}
        </div>
      )}
    </div>
  )
}
