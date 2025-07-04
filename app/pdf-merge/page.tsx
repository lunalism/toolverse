// app/pdf-merge/page.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2 } from 'lucide-react'

export default function PDFMergePage() {
    const [files, setFiles] = useState<File[]>([])

    // 파일 드롭 또는 선택 시 처리
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf')
        setFiles(prev => [...prev, ...pdfFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': [] },
        multiple: true,
    })

    // 개별 파일 제거
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    // 전체 병합 버튼 클릭
    const handleMerge = () => {
        // 병합 로직은 다음 단계에서 구현 예정
        alert('병합 기능은 다음 단계에서 구현됩니다!')
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">📎 PDF 병합 도구</h1>

            {/* 드래그 & 드롭 영역 */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                    {isDragActive ? '여기에 PDF 파일을 놓으세요' : 'PDF 파일을 드래그하거나 클릭하여 업로드하세요'}
                </p>
            </div>

            {/* 업로드된 파일 목록 */}
            {files.length > 0 && (
                <div className="mt-6">
                    <ScrollArea className="max-h-60 border rounded-lg p-4">
                        <ul className="space-y-2">
                            {files.map((file, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 rounded-md px-3 py-2">
                                    <span className="truncate">{file.name}</span>
                                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>

                    <Button className="mt-4 w-full" onClick={handleMerge} disabled={files.length < 2}>
                        병합하기
                    </Button>
                </div>
            )}
        </div>
    )
}
