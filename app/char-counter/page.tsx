'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Copy, Trash2 } from 'lucide-react'

export default function CharCounterPage() {
  const [text, setText] = useState('')
  const [includeSpaces, setIncludeSpaces] = useState(true)

  const characterCount = includeSpaces
    ? text.length
    : text.replace(/\s/g, '').length

  const wordCount = text.trim() === ''
    ? 0
    : text.trim().split(/\s+/).length

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  const handleClear = () => {
    setText('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>🔤</span>
        <span>글자수 세기 도구</span>
      </h1>

      {/* 좌우 2단 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 왼쪽: 입력 영역 */}
        <div>
          <Textarea
            placeholder="여기에 텍스트를 입력하세요..."
            className="min-h-[300px] w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* 오른쪽: 통계 및 버튼 */}
        <div className="flex flex-col justify-between h-full border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 mb-6">
            <Button onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              복사
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>

          {/* 통계 영역 */}
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium">글자 수</p>
              <p>
                <strong>{characterCount}</strong>자 ({includeSpaces ? '공백 포함' : '공백 제외'})
              </p>
            </div>
            <div>
              <p className="font-medium">단어 수</p>
              <p>
                <strong>{wordCount}</strong>개
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="space-toggle"
                checked={includeSpaces}
                onCheckedChange={setIncludeSpaces}
              />
              <Label htmlFor="space-toggle">공백 포함</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
