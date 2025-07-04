'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'
import { ToggleOption } from '@/components/ToggleOption'

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [password, setPassword] = useState('')

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <span className="text-2xl">🔐</span>
          패스워드 생성기
        </h1>
        <p className="text-muted-foreground text-sm">
          안전한 랜덤 비밀번호를 빠르게 만들어보세요.
        </p>
      </div>

      {/* 길이 설정 */}
      <div>
        <Label className="mb-2 block font-medium">
          비밀번호 길이: <span className="font-bold text-primary">{length}자</span>
        </Label>
        <Slider
          min={8}
          max={32}
          step={1}
          defaultValue={[length]}
          onValueChange={([val]) => setLength(val)}
        />
      </div>

      {/* 문자 옵션 */}
      <div className="grid grid-cols-2 gap-4">
        <ToggleOption
          id="uppercase"
          label="대문자 (A-Z)"
          checked={includeUppercase}
          onChange={setIncludeUppercase}
        />
        <ToggleOption
          id="lowercase"
          label="소문자 (a-z)"
          checked={includeLowercase}
          onChange={setIncludeLowercase}
        />
        <ToggleOption
          id="numbers"
          label="숫자 (0-9)"
          checked={includeNumbers}
          onChange={setIncludeNumbers}
        />
        <ToggleOption
          id="symbols"
          label="특수문자 (!@#$...)"
          checked={includeSymbols}
          onChange={setIncludeSymbols}
        />
      </div>

      {/* 생성 버튼 */}
      <Button className="w-full text-base font-semibold rounded-xl">
        비밀번호 생성
      </Button>

      {/* 결과 표시 */}
      {password && (
        <div className="relative rounded-lg border p-3 shadow-sm">
          <Input
            readOnly
            value={password}
            className="pr-10 text-center font-mono text-base border-none"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
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
