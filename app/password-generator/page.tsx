// app/password-generator/page.tsx
'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [password, setPassword] = useState('')

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">🔐 패스워드 생성기</h1>

      {/* 길이 슬라이더 */}
      <div className="mb-6">
        <Label className="mb-2 block">비밀번호 길이: {length}자</Label>
        <Slider min={8} max={64} step={1} defaultValue={[length]} onValueChange={([val]) => setLength(val)} />
      </div>

      {/* 옵션 체크박스 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(v) => setIncludeUppercase(Boolean(v))}/>
          <Label htmlFor="uppercase">대문자 (A-Z)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(v) => setIncludeLowercase(Boolean(v))}/>
          <Label htmlFor="lowercase">소문자 (a-z)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(v) => setIncludeNumbers(Boolean(v))}/>
          <Label htmlFor="numbers">숫자 (0-9)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(v) => setIncludeSymbols(Boolean(v))}/>
          <Label htmlFor="symbols">특수문자 (!@#$...)</Label>
        </div>
      </div>

      {/* 생성 버튼 */}
      <Button className="w-full mb-4" onClick={() => { /* 생성 함수 나중에 연결 */ }}>
        비밀번호 생성
      </Button>

      {/* 결과 영역 */}
      {password && (
        <div className="relative">
          <Input readOnly value={password} className="pr-10 text-center font-mono text-base" />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => {
              navigator.clipboard.writeText(password)
              toast.success('복사되었습니다!')
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
