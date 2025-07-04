'use client'

import { useState } from 'react'
import zxcvbn from 'zxcvbn'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Copy, Minus, Plus, RefreshCw } from 'lucide-react'
import { ToggleOption } from '@/components/ToggleOption'
import Image from 'next/image'

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [password, setPassword] = useState('')

  // 비밀번호 생성 함수
  const generatePassword = () => {
    let charset = ''
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!charset) {
      toast.error('하나 이상의 문자 유형을 선택해주세요.')
      return
    }

    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      result += charset[randomIndex]
    }
    setPassword(result)
  }

  // 복사 버튼 클릭
  const copyPassword = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    toast.success('비밀번호가 복사되었습니다!')
  }

  // zxcvbn 분석
  const strength = zxcvbn(password)
  const rawScore = strength.score // 0~4

  const optionCount = [
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ].filter(Boolean).length

  // 조합이 1가지뿐이면 강도 낮게 보정
  const adjustedScore = optionCount < 2 && rawScore >= 3 ? 2 : rawScore

  const strengthLabel = ['너무 약함', '약함', '보통', '강함', '매우 강함'][adjustedScore]
  const strengthColor = [
    'bg-red-200 text-red-800',
    'bg-orange-200 text-orange-800',
    'bg-yellow-200 text-yellow-800',
    'bg-green-200 text-green-800',
    'bg-green-300 text-green-900',
  ][adjustedScore]

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">무작위 비밀번호 생성기</h1>
        <p className="text-muted-foreground text-base">
          강력하고 안전한 비밀번호를 생성하여 온라인 계정을 보호하세요.
        </p>
      </div>

      {/* 결과창 */}
      <div className="flex items-center gap-2 justify-center mb-6">
        <div className="flex items-center justify-between rounded-full border px-6 py-3 shadow-inner bg-background text-lg font-mono text-center min-w-[280px] w-full max-w-[420px]">
          <span className="truncate">{password || '비밀번호를 생성하세요'}</span>
          {password && (
            <span className={`ml-4 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${strengthColor}`}>
              {strengthLabel}
            </span>
          )}
        </div>
        <Button variant="outline" onClick={copyPassword}>
          <Copy className="w-4 h-4 mr-1" /> 복사
        </Button>
      </div>

      {/* 길이 조절 */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button size="icon" variant="outline" onClick={() => setLength((prev) => Math.max(8, prev - 1))}>
          <Minus className="w-4 h-4" />
        </Button>
        <div className="text-base font-medium">
          비밀번호 길이: <span className="font-bold">{length}</span>
        </div>
        <Button size="icon" variant="outline" onClick={() => setLength((prev) => Math.min(32, prev + 1))}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Slider min={8} max={64} step={1} value={[length]} onValueChange={([val]) => setLength(val)} className="mx-auto w-3/4 mb-6"/>

      {/* 문자 유형 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <ToggleOption id="uppercase" label="ABC" checked={includeUppercase} onChange={setIncludeUppercase} />
        <ToggleOption id="lowercase" label="abc" checked={includeLowercase} onChange={setIncludeLowercase} />
        <ToggleOption id="numbers" label="123" checked={includeNumbers} onChange={setIncludeNumbers} />
        <ToggleOption id="symbols" label="#$&" checked={includeSymbols} onChange={setIncludeSymbols} />
      </div>

      {/* 생성 버튼 */}
      <div className="flex justify-center">
        <Button size="lg" className="rounded-full px-6 text-base" onClick={generatePassword}>
          <RefreshCw className="w-4 h-4 mr-2" /> 비밀번호 생성
        </Button>
      </div>

      {/* 안전 안내 */}
      <p className="text-sm text-muted-foreground text-center mt-8">
        모든 비밀번호는 <span className="font-semibold text-foreground">로컬에서 생성</span>되며,
        절대 인터넷으로 전송되지 않습니다.
      </p>

      {/* ⬇️ 마지막 일러스트 이미지 */}
      <div className="mt-12 flex justify-center">
        <Image src="/password-lock.jpg" alt="비밀번호 보안 이미지" width={300} height={200} className="opacity-90"/>
      </div>
    </div>
  )
}
