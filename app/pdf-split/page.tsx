// app/pdf-split/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function PdfSplitPage() {
    const [splitMode, setSplitMode] = useState<'full' | 'range'>('full')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0])
        }
    }

    return (
        <main className="max-w-screen-md mx-auto px-4 py-20">
            <h1 className="text-2xl font-bold mb-4">📄 PDF 분할 도구</h1>
            <p className="text-gray-600 mb-6">PDF 파일을 페이지 단위로 나누거나 특정 범위만 분할할 수 있어요.</p>

            {/* 파일 업로드 */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF 파일 업로드</label>
                <Input type="file" accept="application/pdf" onChange={handleFileChange} />
                    {selectedFile && (
                        <p className="text-sm text-gray-600 mt-2">선택된 파일: {selectedFile.name}</p>
                    )}
            </div>

            {/* 분할 모드 선택 */}
            <Tabs defaultValue="full" onValueChange={(val) => setSplitMode(val as 'full' | 'range')}>
                <TabsList className="mb-4">
                    <TabsTrigger value="full">전체 분할</TabsTrigger>
                    <TabsTrigger value="range">범위 지정 분할</TabsTrigger>
                </TabsList>

                <TabsContent value="full">
                    <p className="text-sm text-gray-700">PDF의 모든 페이지를 각각의 파일로 분할합니다.</p>
                </TabsContent>

                <TabsContent value="range">
                    <label className="block text-sm text-gray-700 mb-1 mt-2">페이지 범위 (예: 1-3, 5, 7-9)</label>
                    <Input placeholder="1-3,5,7-9" />
                </TabsContent>
            </Tabs>

            {/* 실행 버튼 */}
            <div className="mt-6">
                <Button disabled={!selectedFile}>PDF 분할하기</Button>
            </div>
        </main>
    )
}
