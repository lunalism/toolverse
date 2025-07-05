'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { diffLines, diffWords } from 'diff'

export default function TextComparePage() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diffResult, setDiffResult] = useState<null | { original: string[]; changed: string[]; lineClass: string[] }>(null)

  const escape = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const renderInlineDiff = (a: string, b: string) => {
    const diff = diffWords(a, b)

    const originalLine = diff
      .map(part => {
        if (part.removed) {
          return `<del class="bg-rose-200 text-rose-900 px-1 rounded">${escape(part.value)}</del>`
        } else if (!part.added) {
          return `<span>${escape(part.value)}</span>`
        } else {
          return ''
        }
      })
      .join('')

    const changedLine = diff
      .map(part => {
        if (part.added) {
          return `<ins class="bg-emerald-200 text-emerald-900 px-1 rounded">${escape(part.value)}</ins>`
        } else if (!part.removed) {
          return `<span>${escape(part.value)}</span>`
        } else {
          return ''
        }
      })
      .join('')

    return { originalLine, changedLine }
  }

  const handleCompare = () => {
    const lineDiff = diffLines(textA, textB)
    const original: string[] = []
    const changed: string[] = []
    const lineClass: string[] = []

    let i = 0
    while (i < lineDiff.length) {
      const part = lineDiff[i]

      if (part.added || part.removed) {
        const removed = part.removed ? part : null
        const added = lineDiff[i + 1]?.added ? lineDiff[i + 1] : null

        if (removed && added) {
          const removedLines = removed.value.split('\n')
          const addedLines = added.value.split('\n')
          removedLines.pop()
          addedLines.pop()

          const max = Math.max(removedLines.length, addedLines.length)
          for (let j = 0; j < max; j++) {
            const aLine = removedLines[j] || ''
            const bLine = addedLines[j] || ''
            const { originalLine, changedLine } = renderInlineDiff(aLine, bLine)

            original.push(originalLine)
            changed.push(changedLine)
            lineClass.push('bg-sky-50')
          }

          i += 2
          continue
        }
      }

      const lines = part.value.split('\n')
      lines.pop()
      lines.forEach(line => {
        const escaped = `<span>${escape(line)}</span>`
        if (part.added) {
          original.push('')
          changed.push(escaped)
          lineClass.push('bg-green-50')
        } else if (part.removed) {
          original.push(escaped)
          changed.push('')
          lineClass.push('bg-red-50')
        } else {
          original.push(escaped)
          changed.push(escaped)
          lineClass.push('')
        }
      })

      i++
    }

    setDiffResult({ original, changed, lineClass })
  }

  const handleReset = () => {
    setTextA('')
    setTextB('')
    setDiffResult(null)
  }

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
          <div className="bg-gray-50 px-2 py-2 text-right text-gray-400 select-none w-10 overflow-hidden">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
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
        줄과 단어 단위로 변경된 내용을 색상 대비가 뛰어난 방식으로 비교합니다.
      </p>

      {diffResult === null ? (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <LineNumberInput label="Original text" value={textA} setValue={setTextA} />
            <LineNumberInput label="Changed text" value={textB} setValue={setTextB} />
          </div>
          <Button onClick={handleCompare}>비교하기</Button>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono whitespace-pre-wrap">
            <div>
              <div className="mb-2 font-semibold text-gray-600">Original</div>
              <div className="border rounded-md bg-white">
                {diffResult.original.map((line, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 items-start px-3 py-1 ${diffResult.lineClass[i]}`}
                  >
                    <span className="text-xs text-gray-400 w-6 text-right select-none">
                      {i + 1}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 font-semibold text-gray-600">Changed</div>
              <div className="border rounded-md bg-white">
                {diffResult.changed.map((line, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 items-start px-3 py-1 ${diffResult.lineClass[i]}`}
                  >
                    <span className="text-xs text-gray-400 w-6 text-right select-none">
                      {i + 1}
                    </span>
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
