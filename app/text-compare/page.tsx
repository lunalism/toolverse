'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { diffLines } from 'diff'

export default function TextComparePage() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diffResult, setDiffResult] = useState<null | { original: string[]; changed: string[] }>(null)

  // HTML 이스케이프
  const escape = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // 비교 실행
  const handleCompare = () => {
    const diff = diffLines(textA, textB)

    const original: string[] = []
    const changed: string[] = []

    diff.forEach(part => {
      const lines = part.value.split('\n')
      lines.pop()

      lines.forEach(line => {
        const escaped = escape(line)
        if (part.added) {
          original.push('')
          changed.push(`<span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">+ ${escaped}</span>`)
        } else if (part.removed) {
          original.push(`<span class="bg-red-100 text-red-800 px-2 py-0.5 rounded">- ${escaped}</span>`)
          changed.push('')
        } else {
          original.push(`<span class="text-gray-700">${escaped}</span>`)
          changed.push(`<span class="text-gray-700">${escaped}</span>`)
        }
      })
    })

    setDiffResult({ original, changed })
  }

  const handleReset = () => {
    setTextA('')
    setTextB('')
    setDiffResult(null)
  }

  // 공통 줄번호 + textarea 컴포넌트
  const LineNumberInput = ({
    label,
    value,
    setValue,
  }: {
    label: string
    value: string
    setValue: (val: string) => void
  }) => {
    const lines = value.split('\n')
    return (
      <div>
        <div className="mb-1 font-medium text-sm">{label}</div>
        <div className="relative flex border rounded-md min-h-[300px] overflow-hidden font-mono text-sm">
          {/* 줄번호 영역 */}
          <div className="bg-gray-50 px-2 py-2 text-right text-gray-400 select-none w-10 overflow-hidden">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* 입력창 */}
          <textarea
            className="flex-1 p-2 outline-none resize-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">🆚 텍스트 비교 도구</h1>
      <p className="text-sm text-muted-foreground mb-6">
        두 개의 텍스트를 입력하고 줄 단위 차이점을 시각적으로 비교하세요.
      </p>

      {diffResult === null ? (
        <>
          {/* 입력 UI */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <LineNumberInput label="Original text" value={textA} setValue={setTextA} />
            <LineNumberInput label="Changed text" value={textB} setValue={setTextB} />
          </div>

          <Button onClick={handleCompare}>비교하기</Button>
        </>
      ) : (
        <>
          {/* 결과 UI */}
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono whitespace-pre-wrap">
            <div>
              <div className="mb-2 font-semibold text-gray-600">Original</div>
              <div className="border rounded-md p-3 bg-white">
                {diffResult.original.map((line, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-xs text-gray-400 w-6 text-right select-none">{i + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 font-semibold text-gray-600">Changed</div>
              <div className="border rounded-md p-3 bg-white">
                {diffResult.changed.map((line, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-xs text-gray-400 w-6 text-right select-none">{i + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" onClick={handleReset}>
              초기화하고 다시 비교
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
