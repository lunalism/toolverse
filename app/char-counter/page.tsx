'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Copy, Trash2 } from 'lucide-react'

export default function CharCounterPage() {
    // 입력된 텍스트 상태
    const [text, setText] = useState('')
    const [includeSpaces, setIncludeSpaces] = useState(true)

    // 글자 수 계산 (공백 포함 여부에 따라 분기)
    const characterCount = includeSpaces
        ? text.length
        : text.replace(/\s/g, '').length

    // 단어 수 계산 (공백 기준으로 분리, 공백만 있을 경우 0개)
    const wordCount = text.trim() === ''
        ? 0
        : text.trim().split(/\s+/).length

    // 클립보드 복사
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
    }

    // 입력 초기화
    const handleClear = () => {
        setText('')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>🔤</span>
                <span>글자수 세기 도구</span>
            </h1>
            <p className="text-sm text-muted-foreground">
                입력한 텍스트의 글자 수와 단어 수를 실시간으로 계산합니다.
            </p>

            {/* 좌우 2단 레이아웃: 80% / 20% */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* 왼쪽: 텍스트 입력 (80%) */}
                <div className="flex-[4]">
                    <Textarea
                        placeholder="여기에 텍스트를 입력하세요..."
                        className="min-h-[300px] w-full"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {/* 오른쪽: 통계 및 버튼 (20%) */}
                <div className="flex-[1] border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
                    {/* 버튼 영역 */}
                    <div className="flex justify-end gap-3">
                        <Button onClick={handleCopy}>
                            <Copy className="w-4 h-4 mr-2" />
                                복사
                            </Button>
                        <Button variant="outline" onClick={handleClear}>
                            <Trash2 className="w-4 h-4 mr-2" />
                                초기화
                            </Button>
                    </div>

                    {/* 통계 출력 */}
                    <div className="space-y-4 text-sm text-gray-700">
                        <div>
                            <p className="font-medium">글자 수</p>
                            <p>
                                <strong>{characterCount.toLocaleString()}</strong>자 ({includeSpaces ? '공백 포함' : '공백 제외'})
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">단어 수</p>
                            <p>
                                <strong>{wordCount.toLocaleString()}</strong>개
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch id="space-toggle" checked={includeSpaces} onCheckedChange={setIncludeSpaces}/>
                            <Label htmlFor="space-toggle">공백 포함</Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
